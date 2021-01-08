import express from "express";
import bodyParser from "body-parser";
const server = express();

const employerRoutes = require("../src/controllers/Employer");
const talentRoutes = require("../src/controllers/Talent");
const jobRoutes = require("../src/controllers/Job");

server.use(bodyParser.json());

//directs the routes to the required folder
server.use("/employer", employerRoutes);
server.use("/talent", talentRoutes);
server.use("/job", jobRoutes);

export default server;
