import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StaffAccount {
  email: string
  role: string
  fullName: string
}

// Default staff accounts to seed
const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  { email: 'kalisya@ciptawiratirta.com', role: 'interviewer', fullName: 'Kalisya' },
  { email: 'aman@ciptawiratirta.com', role: 'interviewer_principal', fullName: 'Aman' },
  { email: 'pic.jakarta@ciptawiratirta.com', role: 'pic', fullName: 'PIC Jakarta' },
  { email: 'pic.bali@ciptawiratirta.com', role: 'pic', fullName: 'PIC Bali' },
  { email: 'pic.yogyakarta@ciptawiratirta.com', role: 'pic', fullName: 'PIC Yogyakarta' },
  { email: 'pic.surabaya@ciptawiratirta.com', role: 'pic', fullName: 'PIC Surabaya' },
  { email: 'pic.bandung@ciptawiratirta.com', role: 'pic', fullName: 'PIC Bandung' },
  { email: 'hrd1.internal@ciptawiratirta.com', role: 'hrd', fullName: 'HRD Internal 1' },
  { email: 'hrd2.internal@ciptawiratirta.com', role: 'hrd', fullName: 'HRD Internal 2' },
  { email: 'hrd.external@ciptawiratirta.com', role: 'hrd', fullName: 'HRD External' },
]

const DEFAULT_PASSWORD = 'Cwt@2025!'

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

    // Verify the requesting user is admin or superadmin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestingUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !requestingUser) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if requesting user is admin or superadmin
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requestingUser.id)
      .in('role', ['admin', 'superadmin'])

    if (!roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - admin or superadmin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Seeding staff accounts... Requested by ${requestingUser.email}`)

    const results: { email: string; status: string; error?: string }[] = []

    for (const account of DEFAULT_STAFF_ACCOUNTS) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers?.users?.find(u => u.email === account.email)

        if (existingUser) {
          console.log(`User ${account.email} already exists, skipping...`)
          results.push({ email: account.email, status: 'skipped', error: 'Already exists' })
          continue
        }

        // Create user
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: account.email,
          password: DEFAULT_PASSWORD,
          email_confirm: true,
          user_metadata: {
            full_name: account.fullName
          }
        })

        if (userError) {
          console.error(`Error creating user ${account.email}:`, userError)
          results.push({ email: account.email, status: 'error', error: userError.message })
          continue
        }

        // Assign role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: userData.user.id,
            role: account.role
          })

        if (roleError) {
          console.error(`Error assigning role for ${account.email}:`, roleError)
          results.push({ email: account.email, status: 'created_no_role', error: roleError.message })
          continue
        }

        console.log(`Created user ${account.email} with role ${account.role}`)
        results.push({ email: account.email, status: 'created' })

      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Exception for ${account.email}:`, message)
        results.push({ email: account.email, status: 'error', error: message })
      }
    }

    const created = results.filter(r => r.status === 'created').length
    const skipped = results.filter(r => r.status === 'skipped').length
    const errors = results.filter(r => r.status === 'error').length

    return new Response(
      JSON.stringify({ 
        success: true,
        summary: {
          total: DEFAULT_STAFF_ACCOUNTS.length,
          created,
          skipped,
          errors
        },
        results,
        defaultPassword: DEFAULT_PASSWORD
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Seed staff accounts error:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
