import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerClient = createClient(supabaseUrl, serviceRoleKey);
    
    // Verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await callerClient.auth.getUser(token);
    
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if caller has admin role
    const { data: roles } = await callerClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id);

    const isAdmin = roles?.some(r => ["admin", "superadmin"].includes(r.role));
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get candidate profile id for cleaning up related data
    const { data: profileData } = await callerClient
      .from("candidate_profiles")
      .select("id")
      .eq("user_id", user_id)
      .single();

    if (profileData) {
      // Delete related data
      await callerClient.from("job_applications").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_certificates").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_cvs").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_documents").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_education").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_emergency_contacts").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_experience").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_form_letters").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_medical_tests").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_next_of_kin").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_references").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_skills").delete().eq("candidate_id", profileData.id);
      await callerClient.from("candidate_travel_documents").delete().eq("candidate_id", profileData.id);
      await callerClient.from("saved_jobs").delete().eq("candidate_id", profileData.id);
      await callerClient.from("testimonials").delete().eq("candidate_id", profileData.id);
      // Delete profile
      await callerClient.from("candidate_profiles").delete().eq("user_id", user_id);
    }

    // Delete user roles
    await callerClient.from("user_roles").delete().eq("user_id", user_id);

    // Delete auth user
    const { error: deleteError } = await callerClient.auth.admin.deleteUser(user_id);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
