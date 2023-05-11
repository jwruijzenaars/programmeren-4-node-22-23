const mysql = require("mysql2");
const { config } = require("dotenv");
const dbConfig = require("../config").dbConfig;
const logger = require("../config").logger;
const dbTestConfig = require("../config").dbTestConfig;

config();

// var pool;

if (process.env.NODE_ENV === "test") {
  pool = mysql.createPool(dbTestConfig);
  logger.trace("Connected to database: " + dbTestConfig.database);
} else if (process.env.NODE_ENV === "development") {
  pool = mysql.createPool(dbConfig);
  logger.trace("Connected to database: " + dbConfig.database);
}

pool.on("connection", function (connection) {
  logger.trace("Database connection established");
});

pool.on("acquire", function (connection) {
  logger.trace("Database connection aquired");
});

pool.on("release", function (connection) {
  logger.trace("Database connection released");
});

let query = (sqlQuery, sqlValues, callback) => {
  pool.getConnection(function (err, connection) {
    if (err) {
      logger.error(err.message);
      callback(err.message, undefined);
    }

    connection.query(sqlQuery, sqlValues, (error, results, fields) => {
      connection.release();
      if (error) {
        logger.error("query", error.toString());
        callback(error.message, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  });
};

module.exports = { query, pool };
