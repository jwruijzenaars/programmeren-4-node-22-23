const config = require("../config");
const queries = require("./queries");
const db = require("./database");
const logger = config.logger;

const participationDao = {
  async createParticipation(mealId, userId, result) {
    logger.trace("participationDao create called");
    db.query(queries.PARTICIPATION_CREATE, [mealId, userId], (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
      return;
    });
  },

  async getParticipants(mealId, result) {
    logger.trace("participationDao getAll called");
    db.query(queries.PARTICIPATION_SELECT_ALL, [mealId], (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    });
  },

  async getParticipant(mealId, userId, result) {
    logger.trace("participationDao getOne called");
    db.query(queries.PARTICIPATION_SELECT_ONE, [mealId, userId], (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res) {
        result(null, res);
        return;
      }
    });
  },

  async deleteParticipation(mealId, userId, result) {
    logger.trace("participationDao delete called");
    db.query(queries.PARTICIPATION_DELETE, [mealId, userId], (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    });
  },
};

module.exports = participationDao;
