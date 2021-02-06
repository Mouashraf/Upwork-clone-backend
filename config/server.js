import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const cors = require("cors");

const server = express();

server.use(cors());
server.use("/uploads", express.static("uploads"));
server.use(bodyParser.json());
server.use(cookieParser());

const employerRoutes = require("../src/routes/Employer");
const talentRoutes = require("../src/routes/Talent");
const jobRoutes = require("../src/routes/Job");

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//directs the routes to the required folder
server.use("/employer", employerRoutes);
server.use("/talent", talentRoutes);
server.use("/job", jobRoutes);

//Error Handling
server.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});
server.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

export default server;
