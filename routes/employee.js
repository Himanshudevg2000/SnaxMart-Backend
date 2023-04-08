const express = require('express');

const router = express.Router();

const authentication = require('../middleware/jwtVerify');

const employeeController = require('../controllers/employee');

router.post('/login', employeeController.userlogin);

router.post('/buy', authentication, employeeController.buy);

router.get('/gettransaction', authentication, employeeController.gettransactions);

module.exports = router;