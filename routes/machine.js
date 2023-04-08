const express = require('express');

const router = express.Router();

const machineController = require('../controllers/machine');

router.post('/install', machineController.installMachine);

router.get('/allMachine', machineController.getMachine);

router.put('/deleteMachine', machineController.deleteMachine);

router.put('/editMachine', machineController.editMachine);

module.exports = router;