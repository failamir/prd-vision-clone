import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Only allow INSERT and harmless statements
const ALLOWED_PATTERNS = [
  /^INSERT\s+INTO\s+/i,
  /^--/,            // SQL comments
  /^\s*$/,          // empty lines
];

const BLOCKED_PATTERNS = [
  /DROP\s+/i,
  /DELETE\s+/i,
  /TRUNCATE\s+/i,
  /ALTER\s+/i,
  /CREATE\s+/i,
  /UPDATE\s+(?!.*ON\s+CONFLICT)/i, // block UPDATE unless part of ON CONFLICT
  /GRANT\s+/i,
  /REVOKE\s+/i,
  /EXECUTE\s+/i,
  /SET\s+ROLE/i,
];

function validateStatement(stmt: string): { valid: boolean; reason?: string } {
  const trimmed = stmt.trim();
  if (!trimmed || trimmed.startsWith("--")) return { valid: true };

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, reason: `Blocked statement: ${trimmed.slice(0, 80)}...` };
    }
  }

  const isAllowed = ALLOWED_PATTERNS.some((p) => p.test(trimmed));
  if (!isAllowed) {
    return { valid: false, reason: `Not allowed: ${trimmed.slice(0, 80)}...` };
  }

  return { valid: true };
}

function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";
  let prevChar = "";

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    if (inString) {
      current += char;
      if (char === stringChar && prevChar !== stringChar) {
        // Check for escaped quotes (double single quotes)
        if (i + 1 < sql.length && sql[i + 1] === stringChar) {
          current += sql[i + 1];
          i++;
          prevChar = "";
          continue;
        }
        inString = false;
      }
      prevChar = char;
      continue;
    }

    if (char === "'" || char === '"') {
      inString = true;
      stringChar = char;
      current += char;
      prevChar = char;
      continue;
    }

    if (char === ";") {
      const trimmed = current.trim();
      if (trimmed && !trimmed.startsWith("--")) {
        statements.push(trimmed);
      }
      current = "";
      prevChar = char;
      continue;
    }

    // Handle line comments
    if (char === "-" && i + 1 < sql.length && sql[i + 1] === "-") {
      // Skip to end of line
      const newlineIdx = sql.indexOf("\n", i);
      if (newlineIdx === -1) break;
      i = newlineIdx;
      prevChar = "\n";
      continue;
    }

    current += char;
    prevChar = char;
  }

  const trimmed = current.trim();
  if (trimmed && !trimmed.startsWith("--")) {
    statements.push(trimmed);
  }

  return statements;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userId = claims.claims.sub as string;
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    const { action, sql, dryRun } = await req.json();

    if (action === "validate") {
      // Just validate without executing
      const statements = splitStatements(sql);
      const errors: string[] = [];
      let insertCount = 0;

      for (const stmt of statements) {
        const result = validateStatement(stmt);
        if (!result.valid) {
          errors.push(result.reason!);
        }
        if (/^INSERT\s+INTO\s+/i.test(stmt.trim())) {
          insertCount++;
        }
      }

      // Extract table names
      const tables = new Set<string>();
      for (const stmt of statements) {
        const match = stmt.match(/INSERT\s+INTO\s+(?:public\.)?(\w+)/i);
        if (match) tables.add(match[1]);
      }

      return new Response(
        JSON.stringify({
          valid: errors.length === 0,
          totalStatements: statements.length,
          insertCount,
          tables: Array.from(tables),
          errors: errors.slice(0, 10),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "execute") {
      const statements = splitStatements(sql);
      const errors: string[] = [];
      let successCount = 0;
      let skipCount = 0;

      // Validate all first
      for (const stmt of statements) {
        const result = validateStatement(stmt);
        if (!result.valid) {
          errors.push(result.reason!);
        }
      }

      if (errors.length > 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Validation failed",
            errors: errors.slice(0, 10),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get database URL for direct SQL execution
      const dbUrl = Deno.env.get("SUPABASE_DB_URL");
      if (!dbUrl) {
        return new Response(
          JSON.stringify({ error: "Database URL not configured" }),
          { status: 500, headers: corsHeaders }
        );
      }

      // Import postgres
      const { default: postgres } = await import(
        "https://deno.land/x/postgresjs@v3.4.4/mod.js"
      );
      const pg = postgres(dbUrl, { max: 1 });

      const insertStatements = statements.filter((s) =>
        /^INSERT\s+INTO\s+/i.test(s.trim())
      );

      // Execute in batches
      const BATCH_SIZE = 50;
      for (let i = 0; i < insertStatements.length; i += BATCH_SIZE) {
        const batch = insertStatements.slice(i, i + BATCH_SIZE);
        for (const stmt of batch) {
          try {
            await pg.unsafe(stmt);
            successCount++;
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            // Skip conflict errors silently
            if (msg.includes("duplicate key") || msg.includes("already exists")) {
              skipCount++;
            } else {
              errors.push(`Row ${i + 1}: ${msg.slice(0, 120)}`);
            }
          }
        }
      }

      await pg.end();

      return new Response(
        JSON.stringify({
          success: errors.length === 0,
          message: `Import selesai: ${successCount} berhasil, ${skipCount} dilewati (duplikat), ${errors.length} error`,
          successCount,
          skipCount,
          errorCount: errors.length,
          errors: errors.slice(0, 20),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "validate" or "execute"' }),
      { status: 400, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
