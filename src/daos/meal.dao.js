const config = require("../config");
const queries = require("./queries");
const db = require("./database");
const logger = config.logger;

const mealDao = {
  async create (meal, callback) {
    logger.trace("mealDao Create called");

    let {
        isActive,
        isVega,
        isVegan,
        isToTakeHome,
        dateTime,
        maxAmountOfParticipants,
        price,
        imageUrl,
        cookId,
        createDate,
        updateDate,
        name,
        description,
        allergenes
      } = meal;
  
      db.query(
        queries.MEAL_CREATE,
        [
          isActive,
          isVega,
          isVegan,
          isToTakeHome,
          dateTime,
          maxAmountOfParticipants,
          price,
          imageUrl,
          cookId,
          createDate,
          updateDate,
          name,
          description,
          allergenes
        ],
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
        logger.trace("mealDao getAll called");
        db.query(queries.MEAL_SELECT_All, (err, results) => {
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
        logger.trace("mealDao getOne called");
        db.query(queries.MEAL_SELECT_ONE, [id], (err, results) => {
            if (err) {
                logger.trace("getOne", err);
                callback(err, undefined);
            }
            if (results) {
                callback(undefined, results);
            }
        });
    },

    async update (id, meal, callback) {
        logger.trace("mealDao update called");

        let {
            isActive,
            isVega,
            isVegan,
            isToTakeHome,
            dateTime,
            maxAmountOfParticipants,
            price,
            imageUrl,
            cookId,
            createDate,
            updateDate,
            name,
            description,
            allergenes
          } = meal;
      
          db.query(
            queries.MEAL_UPDATE,
            [
              isActive,
              isVega,
              isVegan,
              isToTakeHome,
              dateTime,
              maxAmountOfParticipants,
              price,
              imageUrl,
              cookId,
              createDate,
              updateDate,
              name,
              description,
              allergenes,
                id
            ], (err, results) => {
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
        logger.trace("mealDao delete called");
        db.query(queries.MEAL_DELETE, [id], (err, results) => {
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

module.exports = mealDao;