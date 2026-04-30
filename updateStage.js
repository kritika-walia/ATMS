const { createClient } = require("@supabase/supabase-js");

// 👉 apna Supabase
const supabase = createClient(
  "https://evhencgqdjwzqghaimut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aGVuY2dxZGp3enFnaGFpbXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzQ0NjgyMywiZXhwIjoyMDkzMDIyODIzfQ.cw5RHALiWqApCCj7_HhaxDviSEHoWwgSVbXRe_4q_J0"
);

async function run() {

  console.log("STARTED");

  // 👉 API call (NHAI wali)
  const authRes = await fetch(
    "https://datalakeg.nhai.gov.in/nhaiapi/api/MastersAPI/user_auth?username=Guest_API&password=Guest%402020",
    {
      headers: {
        "api-key": "0f086a6346192a5c68bbf45ac5cd7766"
      }
    }
  );

  const authData = await authRes.json();
  const token = authData.token || authData.access_token;

  const dataRes = await fetch(
    "https://datalakeg.nhai.gov.in/nhaiapi/api/MastersAPI/NHAI_BasicData_Details",
    {
      headers: {
        "api-key": "0f086a6346192a5c68bbf45ac5cd7766",
        "Authorization": `Bearer ${token}`
      }
    }
  );

  const json = await dataRes.json();

  const list = json.data || json;

  console.log("TOTAL:", list.length);

  // 👉 UPDATE
  for (let item of list) {

    const upc = item.UPC || item.upc;
    const stage = item.ProjectStage || item.current_project_stage;

    if (!upc) continue;

    await supabase
      .from("master_projects")
      .update({
        current_project_stage: stage
      })
      .eq("upc", upc);

    console.log("Updated:", upc);
  }

  console.log("DONE ✅");
}

run();
