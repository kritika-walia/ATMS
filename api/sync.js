const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://evhencgqdjwzqghaimut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aGVuY2dxZGp3enFnaGFpbXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NDY4MjMsImV4cCI6MjA5MzAyMjgyM30.kyJzXYsANeFsfAxbdbmXxRjRTqN4EKs3J7qiX0tHIaI"   // ⚠️ anon key nahi, service role use karo
);

module.exports = async function handler(req, res) {
  try {

    // 🔥 STEP 1: API call (yahan apni real API daalna)
    const apiResponse = await fetch("YOUR_API_URL");
    const apiDataList = await apiResponse.json();

    // Example expected:
    // [{ upc: "123", current_project_stage: "Operational" }]

    // 🔥 STEP 2: Loop through API data
    for (let item of apiDataList) {

      if (!item.upc) continue; // safety check

     await supabase
  .from("master_projects")
  .upsert({
    upc: item.upc,
    current_project_stage: item.current_project_stage
  }, { onConflict: "upc" });

    }

    return res.status(200).json({
      message: "Sync completed successfully ✅",
      records: apiDataList.length
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
