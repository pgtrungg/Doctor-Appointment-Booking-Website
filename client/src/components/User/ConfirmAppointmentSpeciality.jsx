import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Avatar, Box } from '@mui/material';
import { EventNote as DateIcon, Schedule as TimeIcon, AccountCircle as DoctorIcon, Work as SpecialtyIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmAppointmentSpeciality = ({ speciality, date, time }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [slotId, setSlotId] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    axios.get(`/user/getDoctorListByDateAndTime`, { params: { date, time, department: speciality } })
      .then(response => {
        setDoctors(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, [speciality, date, time]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleConfirm = () => {
    const doctor = doctors.find(doc => doc._id === selectedDoctor);
    if (doctor) {
      axios.get(`/user/getSlotId`, { params: { date, doctor_id: doctor._id } })
        .then(response => {
          setSlotId(response.data.data); // Set the slotId state here
          console.log('Slot ID retrieved:', response.data.data);
          axios.post('/user/bookAppointment', {
            user_id: user._id,
            doctor_id: doctor._id,
            slot_id: response.data.data,
            date,
            time,
            notes,
          })
            .then(response => {
              toast.success("Appointment booked successfully, waiting for doctor's approval");
              navigate('/my-appointment'); // Redirect to appointments page or any other page
            })
            .catch(error => {
              console.error('Error booking appointment:', error);
              toast.error("Something went wrong, unable to book appointment");
            });
        })
        .catch(error => {
          console.error('Error fetching slot id:', error);
        });
    } else {
      toast.error("Please select a doctor");
    }
  };


  return (
    <div className="md:w-3/4 mx-auto p-4">
      <Typography variant="h6" gutterBottom>
        <SpecialtyIcon /> Service: <span className="text-gray-600">{speciality}</span>
      </Typography>
      <Typography variant="h6" gutterBottom>
        <DateIcon /> Date: <span className="text-gray-600">{date}</span>
      </Typography>
      <Typography variant="h6" gutterBottom>
        <TimeIcon /> Time: <span className="text-gray-600">{time}</span>
      </Typography>
      <Typography variant="h6" gutterBottom>
        <DoctorIcon /> Doctor: <span className="text-gray-600"></span>
        </Typography>
      <FormControl fullWidth margin="normal">
        {!selectedDoctor && (
        <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
        )}
        <Select
          labelId="doctor-select-label"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        >
          {doctors.map(doctor => (
            <MenuItem key={doctor._id} value={doctor._id}>
              <Box display="flex" alignItems="center">
                <Avatar alt={`Dr. ${doctor.name}`} src={doctor.avatar} style={{ marginRight: '10px' }} />
                <Box>
                  <Typography variant="body1">Dr. {doctor.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{doctor.experience} years of experience</Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="mt-4">
        <label htmlFor="notes" className="block text-lg font-medium text-gray-700">Notes:</label>
        <TextField
          id="notes"
          name="notes"
          rows="4"
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          multiline
          value={notes}
          onChange={handleNotesChange}
        />
      </div>
      <div className="text-center mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          startIcon={<DateIcon />}
          disabled={!selectedDoctor}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default ConfirmAppointmentSpeciality;
