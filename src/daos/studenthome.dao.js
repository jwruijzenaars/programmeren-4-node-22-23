const config = require("../config");
const queries = require("./queries");
const db = require("./database");
const logger = config.logger;

const studentHomeDao = {
  async create (home, callback) {
    logger.debug("create", home);

    let {
      Name,
      Address,
      House_Nr,
      UserID,
      Postal_Code,
      Telephone,
      City
    } = home;

    db.query(
      queries.STUDENTHOME_CREATE,
      [Name, Address, House_Nr, UserID, Postal_Code, Telephone, City],
      (err, results) => {
        if (err) {
          logger.trace("create", err);
          callback(err, undefined);
        }
        if (results) {
          callback(undefined, results);
        }
      }
    );
  },

    async getAll (callback) {
        logger.debug("getAll");
        db.query(queries.STUDENTHOME_GETALL, (err, results) => {
            if (err) {
                logger.trace("getAll", err);
                callback(err, undefined);
            }
            if (results) {
                callback(undefined, results);
            }
        });
    },

    async getOne (id, callback) {
        logger.debug("getOne", id);
        db.query(queries.STUDENTHOME_GETONE, [id], (err, results) => {
            if (err) {
                logger.trace("getOne", err);
                callback(err, undefined);
            }
            if (results) {
                callback(undefined, results);
            }
        });
    },

    async update (id, home, callback) {
        logger.debug("update", id, home);
        let {
            Name,
            Address,
            House_Nr,
            UserID,
            Postal_Code,
            Telephone,
            City
        } = home;

        db.query(queries.STUDENTHOME_UPDATE, [Name, Address, House_Nr, UserID, Postal_Code, Telephone, City, id], (err, results) => {
            if (err) {
                logger.trace("update", err);
                callback(err, undefined);
            }
            if (results) {
                callback(undefined, results);
            }
        });
    },

    async delete (id, callback) {
        logger.debug("delete", id);
        db.query(queries.STUDENTHOME_DELETE, [id], (err, results) => {
            if (err) {
                logger.trace("delete", err);
                callback(err, undefined);
            }
            if (results) {
                callback(undefined, results);
            }
        });
    }
};

module.exports = studentHomeDao;