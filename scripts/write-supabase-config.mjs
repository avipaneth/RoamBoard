import { writeFileSync } from "node:fs";

const { ROAMBOARD_SUPABASE_URL, ROAMBOARD_SUPABASE_ANON_KEY } = process.env;

if (!ROAMBOARD_SUPABASE_URL || !ROAMBOARD_SUPABASE_ANON_KEY) {
  throw new Error("Set ROAMBOARD_SUPABASE_URL and ROAMBOARD_SUPABASE_ANON_KEY before generating supabase-config.js.");
}

const config = `window.ROAMBOARD_SUPABASE_CONFIG = {
  supabaseUrl: ${JSON.stringify(ROAMBOARD_SUPABASE_URL)},
  supabaseAnonKey: ${JSON.stringify(ROAMBOARD_SUPABASE_ANON_KEY)},
};
`;

writeFileSync("supabase-config.js", config);
console.log("Wrote supabase-config.js");
