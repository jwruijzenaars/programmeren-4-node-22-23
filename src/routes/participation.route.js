const express = require('express');
const router = express.Router();
const participationController = require('../controllers/participation.controller');

router.get('/', participationController.getAll);
router.get('/:id', participationController.getOne);
router.post('/', participationController.validateParticipation, participationController.create);
router.put('/:id', participationController.validateParticipation, participationController.update);
router.delete('/:id', participationController.delete);

module.exports = router;