const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const addOrder = require("./controllers/addOrder");
const wayforpayController = require("./controllers/wayforpayGots");
const wayforpayCallbackController = require("./controllers/wayforpayGotsCallback");
const gotsSender = require("./controllers/gotsController");
const { getAllOrders } = require("./controllers/readDB");
const sendMailNOTwfp = require("./controllers/sendMailNOTwfp");
const addCrmProduct = require("./controllers/addCrmProduct");
const changeCrmProduct = require("./controllers/changeCrmProduct");

const app = express();
const port = process.env.PORT || 3001;

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

//firebase
app.get("/orders", getAllOrders);

//email without wfp
app.post("/send-email", sendMailNOTwfp);

//telegram message
app.post("/gots", gotsSender);

//crm
app.post("/crm-add-order", addOrder);
app.post("/crm-add-product", addCrmProduct);
app.post("/crm-change-product", changeCrmProduct);

//wayforpay
app.post("/wayforpay-gots", wayforpayController);
app.post("/wfp-callback-gots", wayforpayCallbackController);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running/ test" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
