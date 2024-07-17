const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");

require("dotenv").config();
const conn = require("./database/conn");
conn();

const autoclaveBrandRoute = require("./routes/autoclaveBrandRoute");
const washerBrandRoute = require("./routes/washerBrandRoute");
const autoclaveRoute = require("./routes/autoclaveModelRoute");
const leadRoute = require("./routes/leadRoute");
const washerRoute = require("./routes/washerModelRoute");
const userRoute = require("./routes/userRoute");

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (_, res) => {
  return res.json({ message: "👋 Welcome to CME API!" });
});

app.use("/autoclaveBrand", autoclaveBrandRoute);
app.use("/washerBrand", washerBrandRoute);
app.use("/autoclaveModel", autoclaveRoute);
app.use("/lead", leadRoute);
app.use("/washerModel", washerRoute);
app.use("/user", userRoute);

module.exports = app;
