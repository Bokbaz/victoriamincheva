import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";

const required = ["SUPABASE_URL"];
const missing = required.filter((key) => !process.env[key]);
const supabaseSecret =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseSecret) {
  missing.push("SUPABASE_SECRET_KEY");
}

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const sourcePath = path.resolve(
  process.argv[2] ?? "Resources/Victoria_FullGlam_Guide.pdf",
);
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "guides";
const destination =
  process.env.SUPABASE_GUIDE_PATH ?? "victoria-full-glam-guide.pdf";

const supabase = createClient(
  process.env.SUPABASE_URL,
  supabaseSecret,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const file = await readFile(sourcePath);
const { error } = await supabase.storage.from(bucket).upload(destination, file, {
  cacheControl: "3600",
  contentType: "application/pdf",
  upsert: true,
});

if (error) {
  console.error(`Guide upload failed: ${error.message}`);
  process.exit(1);
}

console.log(`Uploaded ${sourcePath} to private bucket ${bucket}/${destination}.`);
