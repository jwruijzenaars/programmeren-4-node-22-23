const logger = require("./config").logger;
const queries = require("./daos/queries");
const db = require("./daos/database");

const utils = {

     async getIDByAdress (postalCode, houseNr, callback) {
        logger.debug("getIDByAdress");
        db.query(
          queries.STUDENTHOME_SELECT_ID_BY_ADRESS,
          [postalCode, houseNr],
          (err, results) => {
            if (err) {
              logger.trace("getIDByAdress", err);
            }
            if (results) {
              logger.debug(results[0].ID);
              callback(results[0].ID);
            }
          }
        );
      },

      handleResult (res, next, err, result) {
        if (err) {
          logger.trace("handleResult", err);
          res.status(400).json({
            errCode: 400,
            message: "Failed calling query",
            error: err.toString()
          });
        }
        if (result) {
          res.status(200).json({
            status: "success",
            resultcount: result.length,
            result: result
          });
        }
      },
};
module.exports = utils;