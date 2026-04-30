const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://evhencgqdjwzqghaimut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aGVuY2dxZGp3enFnaGFpbXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQ0NjgyMywiZXhwIjoyMDkzMDIyODIzfQ.cw5RHALiWqApCCj7_HhaxDviSEHoWwgSVbXRe_4q_J0"
);

module.exports = async function handler(req, res) {
  try {

    console.log("SYNC STARTED");

    const response = await fetch("https://evhencgqdjwzqghaimut.supabase.co/rest/v1/");
    const json = await response.json();

    const apiDataList = json.data || json;

    console.log("DATA LENGTH:", apiDataList.length);

if (!Array.isArray(apiDataList)) {
  console.log("API RESPONSE:", json);
  throw new Error("API data is not iterable");
}

for (let item of apiDataList) {

  await supabase
    .from("master_projects")
    .update({
      current_project_stage: item.current_project_stage
    })
    .eq("upc", item.upc);
}
    return res.status(200).json({ success: true });

  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};
