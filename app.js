const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

const { createUser, login } = require("./controllers/users");

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes");

// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
//   };
//   next();
// });

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

// app.post("/signin")
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`App listening at the port ${PORT}`);
  console.log(`this is working`);
});
