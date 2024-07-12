const express = require('express');
const doctorController = require('../controllers/doctorController');
const authDoctorMiddleware = require('../middlewares/authDoctorMiddleware');
const router = express.Router();

router.post('/createSlots', authDoctorMiddleware, doctorController.createSlots);
router.put('/changeAppointmentStatus/:status', authDoctorMiddleware, doctorController.changeAppointmentStatus);
router.put('/handleCancellationRequest/:status', authDoctorMiddleware, doctorController.handleCancellationRequest);
router.get('/getAppointments/:doctor_id', authDoctorMiddleware, doctorController.getAppointments);
module.exports = router;
