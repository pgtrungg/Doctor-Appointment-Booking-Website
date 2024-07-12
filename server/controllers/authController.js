const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signup = async(req, res) => {
    console.log(req.body);
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).send({ message: 'User already exists', success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);

        await newUser.save();
        res.status(200).send({ message: 'User registered successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}

exports.login = async(req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(404)
                .send({ message: 'User not found', success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res
                .status(404)
                .send({ message: 'Incorrect password', success: false });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d',issuer: 'localhost' });
            console.log(token);
            res.cookie('token', token, { 
                secure: true,      
                sameSite: 'none',  
              });
            if(user.role=='doctor'){
                const doctor = await Doctor.findOne({ user_id: user._id });
                const userData ={
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    doctor_id: doctor._id,
                    
                }
                res.status(200).send({ message: 'Login successful', success: true, userData});

            }
            else{
                let userData= user;
                res.status(200).send({ message: 'Login successful', success: true, userData  });
        }
    } 
}   catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    }
}

exports.logout = async(req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: 'Logout successfully', success: true });
}
