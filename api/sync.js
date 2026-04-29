module.exports = async function handler(req, res) {
  try {

    const response = await fetch("https://www.google.com");

    return res.status(200).json({
      message: "Google reachable ✔"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
