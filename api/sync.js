const { createClient } = require("@supabase/supabase-js");

// ⚠️ SERVICE ROLE KEY use karo (anon nahi)
const supabase = createClient(
  "https://evhencgqdjwzqghaimut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aGVuY2dxZGp3enFnaGFpbXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQ0NjgyMywiZXhwIjoyMDkzMDIyODIzfQ.cw5RHALiWqApCCj7_HhaxDviSEHoWwgSVbXRe_4q_J0"
);

module.exports = async function handler(req, res) {
  try {

    // 🔥 STEP 1: API call
    const apiResponse = await fetch("YOUR_API_URL");
    const apiDataList = await apiResponse.json();

    let updatedCount = 0;

    // 🔥 STEP 2: Loop & UPDATE only
    for (let item of apiDataList) {

  await supabase
    .from("master_projects")
    .update({
      current_project_stage: item.current_project_stage
    })
    .eq("upc", item.upc);


      if (error) {
        console.log("Update error:", error);
      } else {
        updatedCount++;
      }
    }

    return res.status(200).json({
      message: "Sync completed successfully ✅",
      total_records: apiDataList.length,
      updated_records: updatedCount
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }

};


