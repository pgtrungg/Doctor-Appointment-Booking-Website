const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');
const Slot = require('../models/slotModel');
const Appointment = require('../models/appointmentModel');
const sendEmail = require('../utils/sendMail');
exports.createSlots = async (req, res) => {
    try {
        const { doctor_id,date} = req.body;
        const doctor = await Doctor.findById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor Not Found" });
        }
        const slotExists = await Slot.findOne({ doctor_id, date });
        if (slotExists) {
            return res.status(400).json({ success: false, message: "Slot already exists for this date" });
        }
        const slot = new Slot(req.body);
        console.log(slot);
        await slot.save();
        res.status(200).json({ success: true, message: "Slot created successfully", data: slot });
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to create slot" });
    }
}

exports.changeAppointmentStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const { appointment_id } = req.body;
        const appointment = await Appointment.findById(appointment_id).populate('user_id').populate('slot_id').populate('doctor_id');
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment Not Found" });
        }
        appointment.status = status;
        const subject = `Appointment ${status}`;
        const html = `<p>Your appointment at ${appointment.time} on ${appointment.slot_id.date.toLocaleDateString()} has been ${status.toLowerCase()} by Dr. ${appointment.doctor_id.name}.</p>`;
        await sendEmail(appointment.user_id.email, subject, html);
        await appointment.save();
        if(status==='Approved'){
            let slot = await Slot.findById(appointment.slot_id);
            // check if time is already present in slot
            if (!slot.time.includes(appointment.time)) {
                return res.status(400).json({ success: false, message: "Invalid Time" });
            }
            slot.time=slot.time.filter(time=>time!==appointment.time);
            console.log(slot.time);
    
            await slot.save();
        }
        if(status==='Rejected'){
           appointment.status='Rejected';
        }
        await appointment.save();



        res.status(200).json({ success: true, message: "Appointment status updated successfully", data: appointment });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to update appointment status" });
    }
}

exports.handleCancellationRequest = async (req, res) => {
    try {
        const { appointment_id } = req.body;
        let status = req.params.status;
        const appointment = await Appointment.findById(appointment_id).populate('user_id').populate('slot_id').populate('doctor_id');
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment Not Found" });
        }
        const subject = `${status === 'Approved' ? 'Appointment Cancelled' : 'Request Rejected'}`;
        const html = `<p>Your request to cancel appointment at ${appointment.time} on ${appointment.slot_id.date.toLocaleDateString()} has been ${status.toLowerCase()} by Dr. ${appointment.doctor_id.name}.</p>`;
        await sendEmail(appointment.user_id.email, subject, html);
        if (status === 'Approved') {
            appointment.status = 'Cancelled';
            let slot = await Slot.findById(appointment.slot_id);
            slot.time.push(appointment.time)
            function convertTimeToMinutes(time) {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            }
            slot.time = slot.time.sort((a, b) => convertTimeToMinutes(a) - convertTimeToMinutes(b));
        
            await slot.save();
        }
        if (status === 'Rejected') {
            console.log('rejected');
            appointment.status = 'Failed for Cancellation';
        }

        
        await appointment.save();
        res.status(200).json({ success: true, message: "Appointment cancelled successfully", data: appointment });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong, unable to cancel appointment" });
    }
}

exports.getAppointments=async(req,res)=>{
    try{
        const doctor_id=req.params.doctor_id;
        console.log(doctor_id);
        const appointments=await Appointment.find({doctor_id:doctor_id}).populate('user_id').populate('slot_id');
        res.status(200).json({ success: true, message: "Appointments retrieved successfully", data: appointments });
    }catch(err){
        res.status(500).json({ success: false, message: "Something went wrong, unable to retrieve appointments" });
    }
}