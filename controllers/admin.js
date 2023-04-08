const jwt = require('jsonwebtoken');
const { admin, employee, transaction } = require('../models');
const helper = require('../helper/helper');
const env = require('../config');
const jwtkey = env.JWT_KEY;

exports.adminSignup = async (req, res) => {
    try {
        const pararms = req.body;
        const admindata = await admin.findOne({
            $and: [
                { email: req.body.email },
                { isDeleted: false }
            ]
        });
        if (admindata) {
            return res.status(500).send({ message: "admin email is already there" });
        }
        const data = new admin({
            email: pararms.email,
            password: helper.generateNewPassword(pararms.password)
        });
        await data.save();
        return res.status(200).send({ message: "admin created" });
    } catch (err) {
        console.log(err);
    }
};

exports.adminlogin = async (req, res) => {
    try {
        const pararms = req.body;
        // const admindata = await admin.find({ email: req.body.email });
        const admindata = await admin.findOne({
            $and: [
                { email: req.body.email },
                { isDeleted: false }
            ]
        });
        console.log(pararms.password)
        console.log(admindata)
        // console.log(checkPassword)
        if (!admindata) {
            return res.status(400).json({ message: "email is not registered" });
        }
        const checkPassword = await helper.comparePassword(pararms.password, admindata.password);
        if (pararms.email !== admindata.email) {
            return res.status(400).json({ message: "incorrect email" });
        }
        if (!checkPassword) {
            return res.status(500).json({ message: "password is wrong" })
        }
        const tokenData = {
            email: admindata.email,
            _id: admindata._id
        };
        const token = jwt.sign(tokenData, jwtkey, { expiresIn: '1d' });
        let result = {
            token,
            id: admindata._id,
            email: admindata.email
        };
        return res.status(200).json({ message: "login successfully", data: result });
    }
    catch (err) {
        console.log(err);
    }
};


exports.createUser = async (req, res) => {
    try {
        const pararms = req.body;
        const employeedata = await employee.findOne({
            $and: [
                { email: req.body.email },
                { isDeleted: false }
            ]
        });
        if (employeedata) {
            return res.status(500).send({ message: "employee email is already there" });
        }
        const data = new employee({
            employeeName: pararms.employeeName,
            companyName: pararms.companyName,
            cardNo: pararms.cardNo,
            email: pararms.email,
            contactNo: pararms.contactNo,
            department: pararms.department,
            password: helper.generateNewPassword(pararms.password)
        });
        await data.save();
        return res.status(200).send({ message: "employee created" });
    } catch (err) {
        console.log(err);
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const data = await employee.find({ isDeleted: false }).select(' _id employeeName companyName email cardNo contactNo department')
        return res.status(200).send({ data: data })
    }
    catch (err) {
        console.log(err);
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const pararms = req.body;
        const data = await employee.findOne({ $and: [{ _id: req.query.id }, { isDeleted: false }] });
        if (!data) {
            return res.status(500).send("id is incorrect")
        }
        let updatedata;
        if (pararms.contactNo) {
            updatedata = await employee.findOneAndUpdate({ _id: req.query.id }, { contactNo: pararms.contactNo })
        }
        if (pararms.employeeName) {
            updatedata = await employee.findOneAndUpdate({ _id: req.query.id }, { employeeName: pararms.employeeName })
        }
        if (pararms.companyName) {
            updatedata = await employee.findOneAndUpdate({ _id: req.query.id }, { companyName: pararms.companyName })
        }
        if (pararms.cardNo) {
            updatedata = await employee.findOneAndUpdate({ _id: req.query.id }, { cardNo: pararms.cardNo })
        }
        if (pararms.department) {
            updatedata = await employee.findOneAndUpdate({ _id: req.query.id }, { department: pararms.department })
        }
        if (pararms.email) {
            updatedata = await employee.findOneAndUpdate({ _id: req.query.id }, { email: pararms.email })
        }
        return res.status(200).send({ message: "updated" })
    }
    catch (err) {
        console.log(err);
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const data = await employee.findOne({ $and: [{ _id: req.query.id }, { isDeleted: false }] });
        if (!data) {
            return res.status(500).send({ message: "employee is not registered" });
        }
        const update = await employee.updateOne(data, { isDeleted: true });
        return res.status(200).send({ message: "employee deleted" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "something went wrong" });
    };
};


exports.getAlltransactions = async (req, res) => {
    try {
        const { machineId, employeeId, cardNo } = req.query;
        const filter = {};
        if (machineId) {
            filter.machineId = machineId;
        }
        if (employeeId) {
            filter.employeeId = employeeId;
        }
        if (cardNo) {
            const employeedata = await employee.find({ cardNo: cardNo });
            if (employeedata) {
                filter.employeeId = employeedata;
            } else {
                res.status(404).send('Employee not found');
                return;
            }
        }
        //   console.log(cardNo)
        const data = await transaction.find(filter, { isDeleted: false })
            .populate('employeeId', ['_id', 'employeeName', 'companyName', 'cardNo', 'email', 'contactNo', 'department'])
            .populate('machineId', ['companyName', 'description', 'location'])
        // console.log(filter)
        return res.status(200).send({ data: data });
    }
    catch (err) {
        console.log(err);
    }
};

