const assert = require('assert');
const studentHomeDao = require('../daos/studenthome.dao');
const utils = require('../utils');
const logger = require('../config').logger;

const studentHomeController = {
    async validateHome(req, res, next) {
        try {
        assert(typeof req.body.Name === 'string', 'Name must be a string');
        assert(typeof req.body.Address === 'string', 'Address must be a string');
        assert(typeof req.body.House_Nr === 'number', 'House_Nr must be a number');
        assert(typeof req.body.Postal_Code === 'string', 'Postal_Code must be a string');
        assert(typeof req.body.Telephone === 'number', 'Telephone must be a number');
        assert(typeof req.body.City === 'string', 'City must be a string');
        next();
        } catch (err) {
            res.status(406).json({
                errCode: 406,
                message: "Failed validation",
                error: err.toString(),
                datetime: new Date().toISOString()
            });
        }
    },

    async create(req, res, next) {
        try {
            const result = await studentHomeDao.create(req.body);
            utils.handleResult(res, next, null, result);
        } catch (err) {
            utils.handleResult(res, next, err, null);
        }
    },

    async getAll(req, res, next) {
        try {
            const result = await studentHomeDao.getAll();
            utils.handleResult(res, next, null, result);
        } catch (err) {
            utils.handleResult(res, next, err, null);
        }
    },

    async getOne(req, res, next) {
        try {
            const result = await studentHomeDao.getOne(req.params.id);
            utils.handleResult(res, next, null, result);
        } catch (err) {
            utils.handleResult(res, next, err, null);
        }
    },

    async update(req, res, next) {
        try {
            const result = await studentHomeDao.update(req.params.id, req.body);
            utils.handleResult(res, next, null, result);
        } catch (err) {
            utils.handleResult(res, next, err, null);
        }
    },

    async delete(req, res, next) {
        try {
            const result = await studentHomeDao.delete(req.params.id);
            utils.handleResult(res, next, null, result);
        } catch (err) {
            utils.handleResult(res, next, err, null);
        }
    }
}

module.exports = studentHomeController;