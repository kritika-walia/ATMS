async function exportToCSV() {

  const { data, error } = await supabaseClient
    .from("atms_forms")
    .select("*");

  if (error) {
    alert("Error fetching data");
    return;
  }

  let csv = [];

  // HEADER
  csv.push([
    "RO","PIU","UPC","Project",
    "Length","Lanes",
    "ATMS Status",
    "OFC Status","OFC Length","OFC Core",
    "Challan","Ambulance",
    "Vendor"
  ].join(","));

  // DATA
  data.forEach(row => {

    csv.push([
      row.ro || "",
      row.piu || "",
      row.upc || "",
      row.project_title || "",
      row.length || "",
      row.lanes || "",
      row.atms_status || "",

      row.ofc?.status || "",
      row.ofc?.length || "",
      row.ofc?.core || "",

      row.monthly?.challan_count || "",
      row.monthly?.ambulance_count || "",

      row.vendor || ""
    ].join(","));

  });

  // DOWNLOAD
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ATMS_Data.csv";
  a.click();
}
