const express = require('express');
const router = express.Router();
const studentHomeController = require('../controllers/studenthome.controller');

router.get('/', studentHomeController.getAll);
router.get('/:id', studentHomeController.getOne);
router.post('/', studentHomeController.create);
router.put('/:id', studentHomeController.update);
router.delete('/:id', studentHomeController.delete);

module.exports = router;
