module.exports = async function handler(req, res) {
  try {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const response = await fetch(
      "https://datalakeg.nhai.gov.in/nhaiapi/api/MastersAPI/user_auth?username=Guest_API&password=Guest%402020",
      {
        method: "GET",
        headers: {
          "api-key": "0f086a6346192a5c68bbf45ac5cd7766"
        }
      }
    );

    const data = await response.text();

    return res.status(200).json({
      message: "Auth working",
      data: data
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
      cause: error.cause
    });
  }
};
