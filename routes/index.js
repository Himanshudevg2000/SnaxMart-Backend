const express = require("express");

const employeeRoutes = require("./employee");
const machineRoutes = require("./machine");
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/employee', employeeRoutes);
router.use('/machine', machineRoutes);
router.use('/admin', adminRoutes);

module.exports = router