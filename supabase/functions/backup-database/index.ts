import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TABLES = [
  "skills", "job_categories", "permissions", "candidate_profiles", "jobs",
  "candidate_cvs", "candidate_certificates", "candidate_documents",
  "candidate_education", "candidate_emergency_contacts", "candidate_experience",
  "candidate_form_letters", "candidate_medical_tests", "candidate_next_of_kin",
  "candidate_references", "candidate_skills", "candidate_travel_documents",
  "contact_submissions", "email_otp_codes", "job_applications",
  "messages", "role_permissions", "saved_jobs", "testimonials", "user_roles",
];

function escapeSQL(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const userId = claims.claims.sub as string;
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: corsHeaders });
    }

    const { action } = await req.json().catch(() => ({ action: "create" }));

    if (action === "list") {
      const { data: files } = await supabaseAdmin.storage.from("database-backups").list("", {
        sortBy: { column: "created_at", order: "desc" },
      });
      return new Response(JSON.stringify({ backups: files || [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "download") {
      const { fileName } = await req.json().catch(() => ({ fileName: "" }));
      const { data, error } = await supabaseAdmin.storage.from("database-backups").createSignedUrl(fileName, 3600);
      if (error) throw error;
      return new Response(JSON.stringify({ url: data.signedUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete") {
      const { fileName } = await req.json().catch(() => ({ fileName: "" }));
      await supabaseAdmin.storage.from("database-backups").remove([fileName]);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Create backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    let sqlContent = `-- Database Backup\n-- Generated: ${new Date().toISOString()}\n\n`;
    const tableData: Record<string, unknown[]> = {};
    let totalRows = 0;

    for (const table of TABLES) {
      const { data, error } = await supabaseAdmin.from(table).select("*");
      if (error) {
        sqlContent += `-- Error fetching ${table}: ${error.message}\n`;
        continue;
      }
      tableData[table] = data || [];
      if (!data || data.length === 0) {
        sqlContent += `-- ${table}: 0 records\n\n`;
        continue;
      }
      totalRows += data.length;
      const columns = Object.keys(data[0] as Record<string, unknown>);
      sqlContent += `-- ${table}: ${data.length} records\n`;
      for (const row of data) {
        const r = row as Record<string, unknown>;
        const values = columns.map((c) => escapeSQL(r[c]));
        sqlContent += `INSERT INTO public.${table} (${columns.join(", ")}) VALUES (${values.join(", ")}) ON CONFLICT DO NOTHING;\n`;
      }
      sqlContent += "\n";
    }

    // Also export auth.users via admin API
    let authSql = "-- Auth Users Export\n\n";
    const allUsers: Array<Record<string, unknown>> = [];
    let page = 1;
    while (true) {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error || !users || users.length === 0) break;
      for (const u of users) {
        allUsers.push(u as unknown as Record<string, unknown>);
        authSql += `INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, created_at, confirmed_at) VALUES (${escapeSQL(u.id)}, ${escapeSQL(u.email)}, ${escapeSQL((u as any).encrypted_password)}, ${escapeSQL(u.user_metadata)}, ${escapeSQL(u.created_at)}, ${escapeSQL(u.confirmed_at)}) ON CONFLICT (id) DO NOTHING;\n`;
      }
      if (users.length < 1000) break;
      page++;
    }

    const fullSql = authSql + "\n" + sqlContent;

    // Upload SQL
    const sqlFileName = `backup-${timestamp}.sql`;
    await supabaseAdmin.storage.from("database-backups").upload(sqlFileName, new Blob([fullSql], { type: "text/plain" }), { upsert: true });

    // Create simple JSON (can be converted to Excel on client)
    const jsonFileName = `backup-${timestamp}.json`;
    const jsonData = { timestamp: new Date().toISOString(), authUsers: allUsers.length, tables: tableData, totalRows };
    await supabaseAdmin.storage.from("database-backups").upload(jsonFileName, new Blob([JSON.stringify(jsonData)], { type: "application/json" }), { upsert: true });

    return new Response(JSON.stringify({
      success: true,
      sqlFile: sqlFileName,
      jsonFile: jsonFileName,
      totalRows,
      authUsers: allUsers.length,
      tables: Object.fromEntries(Object.entries(tableData).map(([k, v]) => [k, (v as unknown[]).length])),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
