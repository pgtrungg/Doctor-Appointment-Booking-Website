const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');

const router = express.Router();
router.get('/profile/:id', authMiddleware, userController.getProfile);
router.put('/updateProfile', authMiddleware, userController.updateProfile);
router.post('/bookAppointment', authMiddleware, userController.bookAppointment);
router.put('/cancelAppointment', authMiddleware, userController.cancelAppointment);
router.get('/getAllDepartments', authMiddleware, userController.getAllDepartments);
router.get('/getDoctorsByDepartment/:department_name', authMiddleware, userController.getDoctorsByDepartment);
router.get('/getDoctorById/:id', authMiddleware, userController.getDoctorById);
router.get('/getAllDoctors', authMiddleware, userController.getAllDoctors);
router.get('/getSlotsByDoctor/:doctor_id', authMiddleware, userController.getSlotsByDoctor);
router.get('/getSlotsByDepartment/:department_name/:date', authMiddleware, userController.getSlotsByDepartment);
router.get('/getDateListDoctor/:doctor_id', authMiddleware, userController.getDateListDoctor);
router.get('/getMyAppointments/:user_id', authMiddleware, userController.getMyAppointments);
router.put('/changePassword', authMiddleware, userController.changePassword);
router.delete('/deleteAccount/:id', authMiddleware, userController.deleteAccount);
router.get('/getDateListDepartment/:department_name',authMiddleware, userController.getDateListDepartment);
router.get('/getDoctorListByDateAndTime',authMiddleware, userController.getDoctorListByDateAndTime);
router.get('/getSlotId',authMiddleware, userController.getSlotId);

module.exports = router;