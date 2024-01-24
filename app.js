const express = require("express");
const app = express();
const productRouter = require("./api/routes/products");
const orderRouter = require("./api/routes/orders");
const userRouter = require("./api/routes/users");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//first comments
// mongoose.Promise = global.Promise;
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function connectDatabase() {
  mongoose
    .connect(
      "mongodb+srv://root:root@cluster0.lbfddf2.mongodb.net/?retryWrites=true&w=majority"
    )
    .then((data) => {
      console.log("connection successful");
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

connectDatabase();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization "
  );
  if (req.method === "OPTION") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message },
  });
});

module.exports = app;
