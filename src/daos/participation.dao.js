const config = require("../config");
const queries = require("./queries");
const db = require("./database");
const logger = config.logger;

const participationDao = {
    async create (newParticipation, result) {
        logger.trace("participationDao create called")
        db.query(
            queries.PARTICIPATION_CREATE,
            [newParticipation.mealId, newParticipation.userId],
            (err, res) => {
                if (err) {
                    logger.error("Create: ", err);
                    result(err, null);
                    return;
                }
                logger.info("Created participation: ", {
                    id: res.insertId,
                    ...newParticipation,
                });
            }
        );
    },

    async getAll (result) {
        logger.trace("participationDao getAll called")
        db.query(queries.PARTICIPATION_SELECT_ALL, (err, res) => {
            if (err) {
                logger.error("getAll: ", err);
                result(err, null);
                return;
            }
            logger.info("Participations: ", res);
            result(null, res);
        });
    },

    async getOne (id, result) {
        logger.trace("participationDao getOne called")
        db.query(queries.PARTICIPATION_SELECT_ONE, [id], (err, res) => {
            if (err) {
                logger.error("getOne: ", err);
                result(err, null);
                return;
            }
            if (res.length) {
                logger.info("Found participation: ", res[0]);
                result(null, res[0]);
                return;
            }
        });
    },

    async delete (id, result) {
        logger.trace("participationDao delete called")
        db.query(queries.PARTICIPATION_DELETE, [id], (err, res) => {
            if (err) {
                logger.error("Delete: ", err);
                result(err, null);
                return;
            }
            logger.info("Deleted participation with id: ", id);
            result(null, res);
        });
    },
};

module.exports = participationDao;