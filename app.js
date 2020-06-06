const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
mongoose.connect(
  "mongodb+srv://marmik:mar0712@cluster0-otaph.mongodb.net/todoapp?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);
let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected To Database");
});

db.on("error", err => {
  console.log(err);
});

// //CORS STUFF
// app.use(require("cors"));
// app.options("*", cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  // res.set("Access-Control-Allow-Headers", "*");
  res.redirect("/todos");
});

app.use("/todos", require("./routes/todos"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Listening on PORT ${PORT}`));
