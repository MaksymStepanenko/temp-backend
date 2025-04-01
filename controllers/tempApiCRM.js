const tempApiCRM = async (req, res) => {
  const data = req.body;
  console.log("data------------>");
  console.log("data", data);
  res.status(200).json({
    message: "OK",
  });
};

module.exports = tempApiCRM;
