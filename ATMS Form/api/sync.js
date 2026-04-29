// Vercel Serverless Function (Node)
export default async function handler(req, res) {
  try {
    // 🔐 ENV variables (Vercel me set karenge)
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // service role key
    const NHAI_API_KEY = process.env.NHAI_API_KEY;

    // 1) AUTH → JWT
    const authUrl = "https://datalakeg.nhai.gov.in/nhaiapi/api/MastersAPI/user_auth?username=Guest_API&password=Guest%402020";

    const authResp = await fetch(authUrl, {
      method: "GET",
      headers: {
        "api-key": NHAI_API_KEY,
        "Content-Type": "application/json"
      }
    });

    if (!authResp.ok) {
      const t = await authResp.text();
      return res.status(500).json({ error: "Auth failed", detail: t });
    }

    const token = await authResp.text(); // JWT string

    // 2) MASTER DATA
    const dataUrl = "https://datalakeg.nhai.gov.in/nhaiapi/api/MastersAPI/NHAI_BasicData_Details";

    const dataResp = await fetch(dataUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!dataResp.ok) {
      const t = await dataResp.text();
      return res.status(500).json({ error: "Data fetch failed", detail: t });
    }

    const projects = await dataResp.json();

    // 3) UPSERT into Supabase via REST
    // (Service Role key se bulk upsert allowed hota hai)
    const upsertResp = await fetch(`${SUPABASE_URL}/rest/v1/master_projects`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates" // upsert on conflict (upc unique)
      },
      body: JSON.stringify(
        projects.map(p => ({
          upc: p.upc,
          project_title: p.project_title,
          implementing_ro: p.implementing_ro,
          piu: p.piu,
          length: p.length,
          lanes: p.lanes,
          nh: p.nh,
          state: p.state,
          district: p.district
        }))
      )
    });

    if (!upsertResp.ok) {
      const t = await upsertResp.text();
      return res.status(500).json({ error: "DB upsert failed", detail: t });
    }

    return res.status(200).json({
      message: "Sync complete",
      count: projects.length
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}