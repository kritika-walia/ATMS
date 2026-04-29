module.exports = async function handler(req, res) {
  try {

    // STEP 1: AUTH API
    const authResp = await fetch(
      "https://datalakeg.nhai.gov.in/nhaiapi/api/MastersAPI/user_auth?username=Guest_API&password=Guest%402020",
      {
        method: "GET",
        headers: {
          "api-key": "0f086a6346192a5c68bbf45ac5cd7766",
          "Content-Type": "application/json"
        }
      }
    );

    const token = await authResp.text();

    // STEP 2: DATA API
    const dataResp = await fetch(
      "https://datalakeg.nhai.gov.in/nhaiapi/api/MastersAPI/NHAI_BasicData_Details",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "api-key": "0f086a6346192a5c68bbf45ac5cd7766"
        }
      }
    );

    const data = await dataResp.json();

    return res.status(200).json({
      message: "API working + data fetched ✅",
      sample: data[0]
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
