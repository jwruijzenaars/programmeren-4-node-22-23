const praticipationController = {
  async validateParticipation(req, res, next) {
    try {
      assert(typeof req.body.mealId === "string", "mealId must be a string.");
      assert(typeof req.body.userId === "string", "userId must be a string.");
      next();
    } catch {
      res.status(406).json({
        errCode: 406,
        message: "Failed validation",
        error: err.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },

  async create(req, res) {
    try {
      await participationDao.create(req.body, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getAll(req, res) {
    try {
      await participationDao.getAll((err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async getOne(req, res) {
    try {
      await participationDao.getOne(req.params.id, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async update(req, res) {
    try {
      await participationDao.update(req.params.id, req.body, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },

  async delete(req, res) {
    try {
      await participationDao.delete(req.params.id, (err, result) => {
        utils.handleResult(res, next, err, result);
      });
    } catch (err) {
      utils.handleResult(res, next, err, null);
    }
  },
};

module.exports = praticipationController;