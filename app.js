const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();

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

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.redirect("/todos");
});

app.use("/todos", require("./routes/todos"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Listening on PORT ${PORT}`));
