#!/usr/bin/env node
/**
 * Run SQL migrations against Supabase using the Management API
 * Usage: node run_migrations.js [migration_file_or_folder]
 */

const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace("https://", "").split(".")[0];

async function executeSQLViaRPC(sql, description) {
  console.log(`\n📄 Running: ${description}`);
  console.log("─".repeat(60));

  // Use the pg_catalog method to execute raw SQL via RPC
  // This works by calling a function that executes the SQL
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql_query: sql }),
  });

  if (response.ok) {
    console.log("✅ Success");
    return { success: true };
  }

  // If exec_sql doesn't exist, we need to create it first or use alternative
  const errorText = await response.text();

  if (errorText.includes("function") && errorText.includes("does not exist")) {
    console.log(
      "⚠️  exec_sql function not found, trying alternative method..."
    );
    return await executeSQLViaAlternative(sql, description);
  }

  console.error("❌ Failed:", errorText);
  return { success: false, error: errorText };
}

async function executeSQLViaAlternative(sql, description) {
  // Split by semicolons and execute via individual table operations
  // This is a workaround when direct SQL execution isn't available

  // For DDL statements, we'll need to use the Supabase Dashboard or CLI
  console.log("⚠️  Direct SQL execution not available via REST API");
  console.log("📋 SQL to execute manually in Supabase Dashboard:");
  console.log("─".repeat(60));
  console.log(sql);
  console.log("─".repeat(60));

  return { success: false, needsManual: true };
}

async function runMigration(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    return false;
  }

  const sql = fs.readFileSync(absolutePath, "utf8");
  const fileName = path.basename(filePath);

  const result = await executeSQLViaRPC(sql, fileName);
  return result.success;
}

async function runAllMigrations(folder) {
  const files = fs
    .readdirSync(folder)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`\n🚀 Found ${files.length} migration files in ${folder}\n`);

  const results = [];
  for (const file of files) {
    const filePath = path.join(folder, file);
    const success = await runMigration(filePath);
    results.push({ file, success });
  }

  console.log("\n" + "═".repeat(60));
  console.log("📊 Migration Results:");
  console.log("═".repeat(60));
  results.forEach((r) => {
    console.log(`${r.success ? "✅" : "❌"} ${r.file}`);
  });

  return results.every((r) => r.success);
}

// Main execution
async function main() {
  const target =
    process.argv[2] || "scripts/019_add_is_licensed_attorney_to_profiles.sql";

  console.log("═".repeat(60));
  console.log("🔄 Supabase Migration Runner");
  console.log("═".repeat(60));
  console.log(`📍 Target: ${target}`);
  console.log(`🔗 Supabase: ${SUPABASE_URL}`);

  const stat = fs.statSync(target, { throwIfNoEntry: false });

  if (!stat) {
    console.error(`❌ Path not found: ${target}`);
    process.exit(1);
  }

  let success;
  if (stat.isDirectory()) {
    success = await runAllMigrations(target);
  } else {
    success = await runMigration(target);
  }

  process.exit(success ? 0 : 1);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
