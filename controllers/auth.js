const User = require("../Models/User")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const path = require("path")
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/Email")
const { promisify } = require("util")
const crypto = require("crypto")
dotenv.config({ path: path.join(__dirname, "./../.env") }) // "../.env" won't work as ./ in anywhere stands for the the directory where the main index.js file resides
const AppError = require("../utils/AppError")


const sendVerificationMail = async (user) => {
    const verificationToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: Date.now() + 2 * 24 * 60 * 60 * 1000
    });
    user.emailVerificationToken = verificationToken; 
    await user.save();
    const verificationLink = `http://localhost:8080/verifyemail/${verificationToken}`;
    sendMail(user.email, `Welcome to NARA", "It's a pleasure to welcome you to our platform! Please click the link to verify this email address: ${verificationLink}`);
}

const createSendToken = async (user, req, res) => {
   try {
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    });
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // secure: req.secure || req.headers['x-forwarded-proto'] === 'https' 
    });
    user.password = undefined;
    
    res.status(200).json({
        status: "OK",
        message: user
    });
   } catch (error) {
    res.status(500).json({status: "ERROR", message: "Something went wrong!"})
    console.log(error)
   }

}

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        });
        await sendVerificationMail(newUser)
        const userData = JSON.parse(JSON.stringify(newUser));
        createSendToken(userData, req, res)


    } catch (error) {
        if (error.name === "ValidationError") {
            console.log(error.name)
            const errorMsgs = Object.values(error.errors).map((el) => el.message);
            res.status(400).json({
                status: "FAIL",
                message: errorMsgs,
            });
        } else if (error.code === 11000) {
            
            const fieldName = Object.keys(error.keyValue)[0];
            const value = error.keyValue[fieldName];
            res.status(400).json({
                status: "FAIL",
                message: `The ${fieldName} ${value} has already been taken!`
            });
        }
        else {
            res.status(500).json({status: "ERROR", message: "Soething went wrong!"});
        }
    }
}


exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) throw new AppError("Invalid Credential!", 401)

        const user = await User.findOne({ email }).select("+password");
        /*
            No-sql injection: {
            "email": {"$ne": null},
            "password": "12345678"
            }

            db.users.find({email: /sim/i})

            {
            "email": { "$regex": "sim", "$options": "i" },
            "password": "12345678"
            }

        */
        // console.log(user)

        if (!user) throw new AppError("Invalid Credential!", 401)

        const correctPassword = await bcrypt.compare(password, user.password)
        
        console.log("Correct Password: ", correctPassword)
        
        if (correctPassword) createSendToken(user, req, res)
        else throw new AppError("Invalid Credential!", 401)
    } catch (error) {
        next(error)
        // res.status(401).json({status: "FAIL", message: "invalid credential"})
    }
}

exports.logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", {
            expires: new Date(Date.now() + 20 * 1000),
            httpOnly: true,
            sameSite: 'None',
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
        });
        res.status(200).json({ status: "OK", message: "Logged out successfully!" });
    } catch (error) {
        next(err)
    }
}

exports.protect = async (req, res, next) => {

    try {
        if (!req.cookies.jwt) {
            console.log("no cookie") 
            return res.status(403).json({ status: "FAIL", message: "You are not authenticated." })
        }
        console.log(req.cookies.jwt)
        const payload = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET_KEY);
        console.log(payload)
        const userId = payload.id;
        const user = await User.findById(userId);

        if (!user) throw new Error("The user associated with this token no longer exists!")
        req.user = user;
        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ status: "FAIL", message: "Invalid token! Please login again." })
            console.log("Invalid token")
        } else {
            res.status(403).json({ status: "ERROR", message: error.message })
            console.log(error.message)
        }
    } 
}

// Define user roles
// Jab jab profile page dekha jaye tab tb user data fetch hoga

