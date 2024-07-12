import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button } from '@mui/material';
import { EventNote as DateIcon, Schedule as TimeIcon, AccountCircle as DoctorIcon, Work as SpecialtyIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmAppointment = ({ doctor_id, date, time, slot_id }) => {
  const [doctor, setDoctor] = useState({});
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    axios.get(`/user/getDoctorById/${doctor_id}`)
      .then(response => {
        setDoctor(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching doctor:', error);
      });
  }, [doctor_id]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleConfirm = () => {
    axios.post('/user/bookAppointment', {
      user_id: user._id,
      doctor_id,
      slot_id,
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
  };

  return (
    <div className="md:w-3/4 mx-auto p-4">
      <Typography variant="h6" gutterBottom>
        <DoctorIcon /> Doctor: <span className="text-gray-600">Dr. {doctor.name}</span>
      </Typography>
      <Typography variant="h6" gutterBottom>
        <SpecialtyIcon /> Service: <span className="text-gray-600">{doctor.department}</span>
      </Typography>
      <Typography variant="h6" gutterBottom>
        <DateIcon /> Date: <span className="text-gray-600">{date}</span>
      </Typography>
      <Typography variant="h6" gutterBottom>
        <TimeIcon /> Time: <span className="text-gray-600">{time}</span>
      </Typography>
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
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

export default ConfirmAppointment;
