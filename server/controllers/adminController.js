const Doctor= require('../models/doctorModel');
const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary');
const upload = require('../middlewares/multer');
const path = require('path');

exports.addDoctor = async (req, res) => {
    console.log(req.body);
    if (req.file) {
        console.log(req.file);
    }
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).send({ message: 'User already exists', success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        // upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        const avatar = result.secure_url;
        const newUser = new User({ ...req.body, role: 'doctor' });
        await newUser.save();
        console.log(result.secure_url)
        const newDoctor = new Doctor({ ...req.body, avatar:avatar, user_id: newUser._id });
        await newDoctor.save();
        const department_exists = await Department.find({name:req.body.department});
        if(department_exists.length===1){
            const department=department_exists[0];
            department.doctor_list.push(newDoctor._id);
            await department.save();
        }
        else{
            const department = new Department({name:req.body.department,doctor_list:[newDoctor._id]});
            await department.save();
        }
        res.status(200).send({ message: 'Doctor registered successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).send({ doctors, success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).send({ message: 'Doctor not found', success: false });
        }
        res.status(200).send({ doctor, success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).send({ message: 'Doctor not found', success: false });
        }
        await User.findByIdAndUpdate(doctor.user_id, {name:req.body.name,email:req.body.email,phone:req.body.phone});
        if(req.body.department!==doctor.department){
            const department_exists_old = await Department.find({name:doctor.department});
            
            if(department_exists_old.length===1){
                const department=department_exists_old[0];
                console.log(department)
                department.doctor_list=department.doctor_list.filter(doc_id=>doc_id!==req.params.id);
                await department.save();
            }
            const department_exists = await Department.find({name:req.body.department});
            if(department_exists.length===1){
                const department=department_exists[0];
                department.doctor_list.push(doctor._id);
                await department.save();
            }
            else{
                const department = new Department({name:req.body.department,doctor_list:[doctor._id]});
                await department.save();
            }
        }
        await Doctor.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send({ message: 'Doctor updated successfully', success: true });
    }
    catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    }
}
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).send({ message: 'Doctor not found', success: false });
        }
        await User.findByIdAndDelete(doctor.user_id);
        await Doctor.findByIdAndDelete(req.params.id);
        const department_exists = await Department.find({name:doctor.department});
        if(department_exists.length===1){
            const department=department_exists[0];
            department.doctor_list=department.doctor_list.filter(doc_id=>doc_id!==req.params.id);
            await department.save();
        }
        res.status(200).send({ message: 'Doctor deleted successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({role:'user'});
        res.status(200).send({ users, success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found', success: false });
        }
        res.status(200).send({ user, success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found', success: false });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'User deleted successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    };
}

exports.uploadAvatar = async (req, res) => {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            return res.status(500).send({ message: 'An error occurred', success: false, err });
        }
        // response url
        res.status(200).send({ message: 'Image uploaded successfully', success: true, url: result.secure_url });
    }
    );
}
