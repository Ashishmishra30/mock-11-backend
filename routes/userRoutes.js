const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const { authentication } = require("../middlewares/authMiddlewares");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({ name, email, password: hash });
            await user.save();
            const token = jwt.sign({ adminID: user._id, admin: user.name }, "masaischool")
            res.status(200).send({ "message": "User registered successfully", token })
        });
    } catch (error) {
        res.status(400).send({ "message": error.message })
    }
})

// Login

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email, password });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ adminID: user._id, admin: user.name }, "masaischool")
                    res.status(200).send({ "message": "User LIgin successfully" })
                } else {
                    res.status(200).send({ "message": "Wrong Email or Password" });
                }
            });
        } else {
            res.status(200).send({ "message": "Wrong Email or Password" });
        }
    } catch (error) {
        res.status(400).send({ "message": error.message })
    }
})

userRouter.get("/profile", authentication, async (req,res) => {
    try {
        const { adminID} = req.user;
        const user = await UserModel.findById(adminID);
        if (user) {
            res.status(200).send({
                name: user.name,
                email: user.email
            });
        } else {
            res.status(400).send({ "message": "User not found" });
        }
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});

//   Calculate-emi

userRouter.post("/calculate-emi", (req, res) => {
    try {
        const { loanAmount, interestRate, tenure } = req.body;
    const principal = Number(loanAmount);
    const roi = Number(interestRate) /12/100;
    const time = Number(tenure);

    const emi =
        principal * roi * Math.pow(1 + roi,time)/(Math.pow(1 + roi,time)-1);
    const interest = emi * time - principal;
    const total = principal + interest;

    res.status(200).send({
        emi: emi.toFixed(2),
        interest: interest.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
    });
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});

module.exports = {
    userRouter,
}