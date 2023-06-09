const config = require("../config");
const queries = require("./queries");
const db = require("./database");
const logger = config.logger;

const userDao = {
  async getAll(callback) {
    logger.trace("userDao getAll called");
    db.query(queries.USER_SELECT_ALL, (err, results) => {
      if (err) {
        logger.trace("getAll", err);
        callback(err, null);
      }
      if (results) {
        callback(null, results);
      }
    });
  },

  async getOwn(id, callback) {
    logger.trace("userDao getOwn called");
    db.query(queries.USER_SELECT_OWN_PROFILE, [id], (err, results) => {
      if (err) {
        logger.trace("getOwn", err);
        callback(err, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  },

  async getOne(id, callback) {
    logger.trace("userDao getOne called", id);
    db.query(queries.USER_SELECT_ONE, [id], (err, results) => {
      if (err) {
        logger.trace("getOne", err);
        callback(err, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  },

  async update(id, user, callback) {
    logger.trace("userDao update called");

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
    } = user;
    db.query(
      queries.USER_UPDATE,
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
        id,
      ],
      (err, results) => {
        if (err) {
          logger.trace("update", err);
          callback(err, undefined);
        }

        if (results) {
          callback(undefined, results);
        }
      }
    );
  },

  async delete(id, callback) {
    logger.trace("userDao delete called");
    db.query(queries.USER_DELETE, [id], (err, results) => {
      if (err) {
        logger.trace("delete", err);
        callback(err, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  },

  async getByCityAndRoles(city, roles, callback) {
    logger.trace("userDao getByCityAndRoles called");
    const formattedRoles = "%" + roles + "%";
    db.query(queries.USER_PER_CITY_AND_ROLES, [city, formattedRoles], (err, results) => {
      if (err) {
        logger.trace("getByCityAndRoles", err);
        callback(err, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  },

  async getByCity(city, callback) {
    logger.trace("userDao getByCity called");
    db.query(queries.USER_PER_CITY, [city], (err, results) => {
      if (err) {
        logger.trace("getByCity", err);
        callback(err, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  },

  async getByRoles(roles, callback) {
    logger.trace("userDao getByRoles called");
    const formattedRoles = "%" + roles + "%";
    db.query(queries.USER_PER_ROLES, [formattedRoles], (err, results) => {
      if (err) {
        logger.trace("getByRoles", err);
        callback(err, undefined);
      }
      if (results) {
        callback(undefined, results);
      }
    });
  },
};

module.exports = userDao;
