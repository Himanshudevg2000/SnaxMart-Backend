const jwt = require('jsonwebtoken');
const { employee, machine, transaction } = require('../models');
const helper = require('../helper/helper');
const env = require('../config');
const jwtkey = env.JWT_KEY;

exports.userlogin = async (req, res) => {
    try {
        const pararms = req.body;
        // const employeedata = await employee.find({ email: req.body.email });
        const employeedata = await employee.findOne({
            $and: [
                { email: req.body.email },
                { isDeleted: false }
            ]
        });
        const machinedata = await machine.findOne({
            $and: [
                { _id: req.body.machineId },
                { isDeleted: false }
            ]
        });
        // console.log(pararms.password)
        // console.log(employeedata)
        // console.log(machinedata)
        if (!employeedata) {
            return res.status(400).json({ message: "email is not registered" });
        }
        const checkPassword = await helper.comparePassword(pararms.password, employeedata.password);
        // console.log(checkPassword)
        if (machinedata.companyName !== pararms.companyName) {
            return res.status(400).json({ message: "Not registered with this company" });
        }
        if (pararms.email !== employeedata.email) {
            return res.status(400).json({ message: "incorrect email" });
        }
        if (!checkPassword) {
            return res.status(500).json({ message: "password is wrong" })
        }
        const tokenData = {
            email: employeedata.email,
            _id: employeedata._id
        };
        const token = jwt.sign(tokenData, jwtkey, { expiresIn: '1d' });
        let result = {
            token,
            id: employeedata._id,
            email: employeedata.email,
            machineId: machinedata._id
        };
        return res.status(200).json({ message: "login successfully", data: result });
    }
    catch (err) {
        console.log(err);
    }
};

exports.buy = async (req, res) => {
    try {
        const pararms = req.body;
        if (!pararms.machineId) {
            return res.status(500).send({ message: "please enter machineId" });
        }
        if (!pararms.employeeId) {
            return res.status(500).send({ message: "please enter employeeId" });
        }
        if (!pararms.slotName) {
            return res.status(500).send({ message: "please enter slotName" });
        }
        // const machinedata = await machine.find({})
        const data = new transaction({
            machineId: pararms.machineId,
            employeeId: pararms.employeeId,
            slotName: pararms.slotName,
            transactionStatus: true
        });
        await data.save();
        return res.status(200).send({ message: "YES", data: data })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ message: "NO" });
    }
};

exports.gettransactions = async (req, res) => {
    try {
        // const data = await transaction.find({
        //     $and: [{
        //         $or: [
        //             { employeeId: req.query.employeeId },
        //             { machineId: req.query.machineId }
        //         ]
        //     },
        //     { isDeleted: false }
        //     ]
        // })
        //     .populate('employeeId', ['_id', 'employeeName', 'companyName', 'cardNo', 'email', 'contactNo', 'department'])
        //     .populate('machineId', ['companyName', 'description', 'location'])

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