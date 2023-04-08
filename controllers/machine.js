const { machine } = require('../models');

exports.installMachine = async (req, res) => {
    try {
        const pararms = req.body;
        const data = new machine({
            companyName: pararms.companyName,
            description: pararms.description,
            location: pararms.location,
        })
        await data.save();
        return res.status(200).send({ message: "machine installed", data: data });
    }
    catch (err) {
        console.log(err);
    };
};

exports.getMachine = async (req, res) => {
    try {
        const data = await machine.find({ isDeleted: false });
        return res.status(200).send({ message: "All installed", data: data });
    }
    catch (err) {
        return res.status(500).send({ message: "something went wrong" })
    };
};

exports.deleteMachine = async (req, res) => {
    try {
        const data = await machine.findOne({ $and: [{ _id: req.query.id }, { isDeleted: false }] });
        if(!data){
            return res.status(500).send("please enter correct id");
        }
        const update = await machine.findByIdAndUpdate({ _id: req.query.id }, { isDeleted: true })
        // console.log(data)
        // console.log(update)
        return res.status(200).send({ message: "deleted" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "something went wrong" });
    };
};

exports.editMachine = async (req, res) => {
    try {
        const pararms = req.body;
        const data = await machine.findOne({ $and: [{ _id: req.query.id }, { isDeleted: false }] });
        if (!data) {
            return res.status(500).send("please enter correct id");
        }
        // console.log(data)
        // console.log(pararms)
        let update;
        if (req.body.description) {
            update = await machine.findByIdAndUpdate({ _id: req.query.id }, { description: pararms.description })
            return res.status(200).send({ message: "updated successfully", data });
        }
        if (req.body.companyName) {
            update = await machine.findByIdAndUpdate({ _id: req.query.id }, { companyName: pararms.companyName })
            return res.status(200).send({ message: "updated successfully", data });
        }
        if (req.body.location) {
            update = await machine.findByIdAndUpdate({ _id: req.query.id }, { location: pararms.location })
            return res.status(200).send({ message: "updated successfully", data });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("something went wrong");
    }
}