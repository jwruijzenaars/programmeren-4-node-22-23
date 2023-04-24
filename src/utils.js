const logger = require("./config").logger;
const queries = require("./daos/queries");
const db = require("./daos/database");

const utils = {

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
            status: 200,
            resultcount: result.length,
            result: result
          });
        }
      },
};
module.exports = utils;