const config = require("../config");
const queries = require("./queries");
const db = require("./database");
const logger = config.logger;

const authDao = {
  async login(body, callback) {
    logger.trace("authDao login called");
    db.query(queries.USER_LOGIN, [body.emailAdress], (err, results) => {
      if (err) {
        logger.trace("login", err);
        callback(err, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  },

  async register(body, callback) {
    logger.trace("authDao register called");
    let {
      firstName,
      lastName,
      isActive,
      emailAdress,
      password,
      phoneNumber,
      roles,
      street,
      city,
    } = body;

    connection.query(
      queries.USER_CREATE,
      [
        firstName,
        lastName,
        isActive,
        emailAdress,
        password,
        phoneNumber,
        roles,
        street,
        city,
      ],
      (err, results) => {
        if (err) {
          logger.trace("register", err);
          callback(err, undefined);
        }
        if (results) {
          callback(undefined, results);
        }
      }
    );
  },
};

module.exports = authDao;