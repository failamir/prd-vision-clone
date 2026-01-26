import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000
    })

    if (authError) {
      throw authError
    }

    // Get all user roles
    const { data: allRoles } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role')

    // Get all candidate profiles
    const { data: profiles } = await supabaseAdmin
      .from('candidate_profiles')
      .select('user_id, full_name, email, created_at, is_archived, archived_at')

    // Create maps for quick lookup
    const rolesMap = new Map<string, string[]>()
    allRoles?.forEach(r => {
      const existing = rolesMap.get(r.user_id) || []
      existing.push(r.role)
      rolesMap.set(r.user_id, existing)
    })

    const profilesMap = new Map<string, any>()
    profiles?.forEach(p => {
      profilesMap.set(p.user_id, p)
    })

    // Build complete user list from auth.users
    const users = authUsers.users.map(authUser => {
      const profile = profilesMap.get(authUser.id)
      const userRoles = rolesMap.get(authUser.id) || []
      
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Unknown',
        created_at: authUser.created_at,
        roles: userRoles.length > 0 ? userRoles : ['candidate'],
        is_archived: profile?.is_archived || false,
        archived_at: profile?.archived_at || null,
        has_profile: !!profile
      }
    })

    // Sort by created_at descending
    users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return new Response(
      JSON.stringify({ users }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
