import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { connect } from "https://deno.land/x/redis@v0.32.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CACHE_KEY = 'users:all';
const CACHE_TTL = 300; // 5 minutes

async function getRedisClient() {
  try {
    const redis = await connect({
      hostname: Deno.env.get('REDIS_HOST') ?? '127.0.0.1',
      port: parseInt(Deno.env.get('REDIS_PORT') ?? '6379', 10),
      password: Deno.env.get('REDIS_PASSWORD') ?? undefined,
      maxRetryCount: 2,
      tls: false,
    });
    return redis;
  } catch (err) {
    console.error('Redis connection failed:', err);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin or superadmin
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
    
    const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'superadmin')
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for cache-busting param
    const url = new URL(req.url);
    const noCache = url.searchParams.get('nocache') === '1';

    // Try Redis cache first
    let redis = null;
    if (!noCache) {
      redis = await getRedisClient();
      if (redis) {
        try {
          const cached = await redis.get(CACHE_KEY);
          if (cached) {
            console.log('✅ Serving users from Redis cache');
            redis.close();
            return new Response(cached, {
              headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' }
            });
          }
        } catch (e) {
          console.error('Redis get error:', e);
        }
      }
    }

    // Fetch fresh data
    const [authUsersResult, allRolesResult, profilesResult] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin.from('user_roles').select('user_id, role'),
      supabaseAdmin.from('candidate_profiles').select('user_id, full_name, email, phone, created_at, is_archived, archived_at, registration_city'),
    ]);

    if (authUsersResult.error) throw authUsersResult.error;

    const rolesMap = new Map<string, string[]>()
    allRolesResult.data?.forEach(r => {
      const existing = rolesMap.get(r.user_id) || []
      existing.push(r.role)
      rolesMap.set(r.user_id, existing)
    })

    const profilesMap = new Map<string, any>()
    profilesResult.data?.forEach(p => {
      profilesMap.set(p.user_id, p)
    })

    const users = authUsersResult.data.users.map(authUser => {
      const profile = profilesMap.get(authUser.id)
      const userRoles = rolesMap.get(authUser.id) || []
      
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Unknown',
        phone: profile?.phone || null,
        created_at: authUser.created_at,
        roles: userRoles.length > 0 ? userRoles : ['candidate'],
        is_archived: profile?.is_archived || false,
        archived_at: profile?.archived_at || null,
        registration_city: profile?.registration_city || null,
        has_profile: !!profile
      }
    })

    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const responseBody = JSON.stringify({ users });

    // Store in Redis cache
    if (!redis) redis = await getRedisClient();
    if (redis) {
      try {
        await redis.setex(CACHE_KEY, CACHE_TTL, responseBody);
        console.log('✅ Users cached in Redis (TTL: 5 min)');
        redis.close();
      } catch (e) {
        console.error('Redis set error:', e);
        try { redis.close(); } catch (_) {}
      }
    }

    return new Response(responseBody, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
