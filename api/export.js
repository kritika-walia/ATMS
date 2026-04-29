import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

export default async function handler(req, res) {

  // 🔐 simple admin protection (optional)
  const ADMIN_KEY = "12345";

  if (req.query.key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // 🔹 fetch data
  const { data, error } = await supabase
    .from("atms_forms")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  // 🔹 convert to excel
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ATMS");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });

  // 🔹 send file
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=ATMS_Data.xlsx"
  );

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.send(buffer);
}
