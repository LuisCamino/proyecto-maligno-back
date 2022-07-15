const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("./src/utils/auth/index");
dotenv.config();

const UsersRoutes = require("./src/api/users/user.routes");

const { connectDb } = require("./src/utils/database/database");
const { isAuthenticated } = require("./src/utils/middlewares/auth.middlewares");

const PORT = process.env.PORT || 8080;

const app = express();
app.disable("x-powered-by");
connectDb();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT, PATCH");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:4500",
      "http://localhost:4200",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  express.json({
    limit: "5mb",
  })
);

app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use("/users", UsersRoutes);

app.use("/", (req, res) => {
  return res.status(200).json("users api working");
});

app.use("*", (req, res, next) => {
  return res.status(404).json("Route not found");
});

app.use((error, req, res, next) => {
  return res
    .status(error.status || 500)
    .json(error.message || "Unexpected error");
});

app.listen(PORT, () => {
  console.log(`listening in http://localhost:${PORT}`);
});
