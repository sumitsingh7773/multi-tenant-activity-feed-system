const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const activityRoutes = require("./routes/activityRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/activityFeed")
  .then(() => console.log("MongoDB connected"));

app.use("/api", activityRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
