const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Slot = require('../models/slotModel');
const Department=require('../models/departmentModel')
const Appointment = require('../models/appointmentModel');
const bcrypt = require('bcryptjs');


exports.getProfile = async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        const { password, ...rest } = user._doc;

        res.status(200).json({ success: true, message: "Profile info retrieved successfully", data: {...rest } });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve profile" });
    }
}

exports.updateProfile = async(req, res) => {

    try {
        console.log(req.body)
        const updatedUser = await User.findByIdAndUpdate(req.body.userId, { $set: req.body }, { new: true })

        res.status(200).json({ success: true, message: "Successfully updated", data: updatedUser })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "Failed to Update" })
    }

}

exports.bookAppointment = async(req, res) => {
    try {
        const {user_id, doctor_id, slot_id, date, time } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }
        const doctor = await Doctor.findById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor Not Found" });
        }
        const slot = await Slot.findById(slot_id);
        if (!slot) {
            return res.status(404).json({ success: false, message: "Slot Not Found" });
        }
        if (!slot.time.includes(time)) {
            return res.status(400).json({ success: false, message: "Invalid Time" });
        }
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(200).json({ success: true, message: "Appointment booked successfully", data: appointment });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to book appointment" });
    }
}

exports.cancelAppointment = async (req, res) => {
    try {
        const { appointment_id } = req.body;
        const appointment = await Appointment.findById(appointment_id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment Not Found" });
        }
        if (appointment.status === "Approved") {
        appointment.status = "Request for Cancellation";
        }
        else {
            appointment.status = "Cancelled";
        }
        await appointment.save();
        res.status(200).json({ success: true, message: "Appointment status updated successfully", data: appointment });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to update appointment status" });
    }
}
exports.getAllDepartments = async(req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ success: true, message: "Departments retrieved successfully", data: departments });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve departments" });
    }
}
exports.getDoctorsByDepartment = async(req, res) => {
    try {
        const department_name = req.params.department_name;
        const doctors = await Doctor.find({department: department_name });
        res.status(200).json({ success: true, message: "Doctors retrieved successfully", data: doctors });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve doctors" });
    }
}
exports.getAllDoctors = async(req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({ success: true, message: "Doctors retrieved successfully", doctors });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve doctors" });
    }
}
exports.getDoctorById = async(req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor Not Found" });
        }
        res.status(200).json({ success: true, message: "Doctor retrieved successfully", data: doctor });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve doctor" });
    }
}

exports.getSlotsByDoctor = async (req, res) => {
    try {
        const doctor_id = req.params.doctor_id;
        const selectedDate = new Date(req.query.date);

        // Kiểm tra xem ngày được chọn có hợp lệ không
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và milli giây về 0 để so sánh chỉ ngày tháng

        if (selectedDate < today) {
            return res.status(400).json({ success: false, message: "Invalid Date" });
        }

        // Tạo mốc thời gian bắt đầu và kết thúc của ngày
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Tìm kiếm slots trong khoảng thời gian của ngày được chọn
        const slots = await Slot.findOne({
            doctor_id: doctor_id,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        console.log(slots);

        res.status(200).json({ success: true, message: "Slots retrieved successfully", data: slots });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve slots" });
    }
};



exports.getSlotsByDepartment = async (req, res) => {
    try {
        const department = req.params.department_name;
        const date = new Date(req.params.date);
        const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        const doctors = await Doctor.find({ department: department });
        let slots = [];

        for (let i = 0; i < doctors.length; i++) {
            let doctorSlots = await Slot.find({
                doctor_id: doctors[i]._id,
                date: { $gte: startDate, $lt: endDate } // Lọc theo ngày trong khoảng từ startDate đến endDate
            });
            slots = slots.concat(doctorSlots);
        }

        let slotSet = new Set();
        slots.forEach(slot => {
            slot.time.forEach(time => {
                slotSet.add(time);
            });
        });

        function convertTimeToMinutes(time) {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        }

        let slotArray = Array.from(slotSet);
        slotArray = slotArray.sort((a, b) => convertTimeToMinutes(a) - convertTimeToMinutes(b));

        res.status(200).json({ success: true, message: "Slots retrieved successfully", data: slotArray });

    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve slots" });
    }
}

exports.getDateListDoctor = async(req, res) => {
    try {
        const doctor_id = req.params.doctor_id;
        const slots = await Slot.find({ doctor_id: doctor_id });
        let dateSet = new Set();
        slots.forEach(slot => {
            dateSet.add(slot.date);
        });
        dateArray = Array.from(dateSet);
        dateArray = dateArray.filter(date => date > Date.now());
        res.status(200).json({ success: true, message: "Dates retrieved successfully", data: dateArray });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve dates" });
    }
}
exports.getMyAppointments = async(req, res) => {
    try {
        console.log(123)
        const user_id = req.params.user_id;
        const appointments = await Appointment.find({ user_id: user_id }).populate('doctor_id').populate('slot_id');
        res.status(200).json({ success: true, message: "Appointments retrieved successfully", data: appointments });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve appointments" });
    }
}

exports.getDateListDepartment = async (req, res) => {
  try {
    const department = req.params.department_name;
    const doctors = await Doctor.find({ department: department });

    let slots = [];
    for (let i = 0; i < doctors.length; i++) {
      let doctorSlots = await Slot.find({ doctor_id: doctors[i]._id });
      slots = slots.concat(doctorSlots);
    }

    let dateSet = new Set();
    slots.forEach(slot => {
      // Convert date to ISO string without time and add to Set
      dateSet.add(slot.date.toISOString().split('T')[0]);
    });

    let dateArray = Array.from(dateSet).filter(date => new Date(date) > new Date());
    console.log(dateArray);
    res.status(200).json({ success: true, message: "Dates retrieved successfully", data: dateArray });
  } catch (err) {
    console.error('Error retrieving dates:', err);
    res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve dates" });
  }
};

exports.changePassword = async(req, res) => {
    console.log(req.body)
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found', success: false });
        }
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isMatch) {
            return res.status(404).send({ message: 'Incorrect password', success: false });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({ message: 'Password changed successfully', success: true });
    }
    catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    }
}
exports.deleteAccount = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found', success: false });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Account deleted successfully', success: true });
    }
    catch (error) {
        res.status(500).send({ message: 'An error occurred', success: false, error });
    }
}

exports.getDoctorListByDateAndTime = async (req, res) => {
    try {
        const { date, time, department } = req.query;

        // Tạo ngày bắt đầu và ngày kết thúc từ ngày yêu cầu
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1); // Ngày kết thúc là ngày bắt đầu cộng thêm 1 ngày

        // Tìm tất cả các slot có ngày nằm trong khoảng từ startDate (bao gồm) đến endDate (không bao gồm)
        const slots = await Slot.find({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        // Lọc ra các slot có thời gian chứa thời gian được yêu cầu và thuộc department
        const doctorIds = slots
            .filter(slot => slot.time.includes(time))
            .map(slot => slot.doctor_id);

        // Truy vấn danh sách bác sĩ dựa trên các ID đã lọc và thuộc department
        const doctors = await Doctor.find({ 
            _id: { $in: doctorIds },
            department: department 
        });

        res.status(200).json({ success: true, message: "Doctors retrieved successfully", data: doctors });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve doctors" });
    }
}
exports.getSlotId = async (req, res) => {
    try {
        const { doctor_id, date } = req.query;
        console.log(doctor_id, date)
        // Convert the date string to a Date object and get the start and end of the day
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0); // Set to the beginning of the day

        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999); // Set to the end of the day

        // Find the slot where the date is within the day range
        const slot = await Slot.findOne({
            doctor_id,
            date: {
                $gte: startDate.toISOString(),
                $lte: endDate.toISOString()
            }
        });

        if (!slot) {
            return res.status(404).json({ success: false, message: "Slot Not Found" });
        }


        res.status(200).json({ success: true, message: "Slot retrieved successfully", data: slot._id });
    } catch (err) {
        console.error('Error retrieving slot:', err);
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve slot" });
    }
}

