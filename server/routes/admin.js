const express = require('express');
const adminController = require('../controllers/adminController');

const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = require('../middlewares/multer');
const path = require('path');

router.post('/addDoctor',upload.single('avatar'), authAdminMiddleware, adminController.addDoctor);
router.get('/getAllDoctors', authAdminMiddleware, adminController.getAllDoctors);
router.get('/getDoctorById/:id', authAdminMiddleware, adminController.getDoctorById);
router.put('/updateDoctor/:id', authAdminMiddleware, adminController.updateDoctor);
router.delete('/deleteDoctor/:id', authAdminMiddleware, adminController.deleteDoctor);
router.get('/getAllUsers',authAdminMiddleware, adminController.getAllUsers);   
router.get('/getUserById/:id', authMiddleware, adminController.getUserById);
router.delete('/deleteUser/:id', authAdminMiddleware, adminController.deleteUser);
router.post('/uploadAvatar', upload.single('avatar'),authAdminMiddleware, adminController.uploadAvatar);
module.exports = router;