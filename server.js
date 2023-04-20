const http = require('http');
require('dotenv').config();
const express = require('express');
const studentHomeRoutes = require('./src/routes/studenthome.route');
const mealRoutes = require('./src/routes/meal.route');
const userRoutes = require('./src/routes/user.route');
const participationRoutes = require('./src/routes/participation.route');
const authRoutes = require('./src/routes/auth.route');
const logger = require('./src/config').logger;


const app = express();
const port = process.env.PORT || 3003;
const systemInfo = {
    systemInfo: {
        studentName: "Jan Willem Ruijzenaars",
        studentNumber: 2150617,
        description: "A system for students to manage their meals in their student homes",
    }
}

app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.all("*", (req, res, next) => {
    const method = req.method;
    const url = req.url;
    logger.debug("The used method is: ", method, " on url: ", url);
    next();
  });

  app.use("/api/studenthome", studentHomeRoutes);
  app.use("/api/meal", mealRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/participation", participationRoutes);
  app.use("/api/auth", authRoutes);


  app.get("/api/info", (req, res) => {
    logger.debug("/api/info called, getting system info");
    res.send(systemInfo).status(200);
  });
  
  app.get("*", (req, res) => {
    logger.warn(`Incorrect route: ${req.url}`);
  });
  
  const server = http.createServer(app);
  server.listen(port, () => {
    logger.debug(`Server running at port: ${port}`);
  });
  module.exports = server;