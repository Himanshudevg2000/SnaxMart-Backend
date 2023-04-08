const express = require('express');

const router = express.Router();

const authentication = require('../middleware/jwtVerify');

const adminController = require('../controllers/admin');

router.post('/signup', adminController.adminSignup);

router.post('/login', adminController.adminlogin);

router.post('/usersignup',authentication, adminController.createUser);

router.get('/allemployee', authentication, adminController.getEmployee);

router.put('/updateemployee', authentication, adminController.updateEmployee);

router.put('/deleteemployee', authentication, adminController.deleteEmployee);

router.get('/alltransactions', authentication, adminController.getAlltransactions);

module.exports = router;