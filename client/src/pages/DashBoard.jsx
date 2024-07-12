import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { DatePicker, Select } from "antd";
import { Input } from 'antd';
import axios from 'axios';
import DoctorImage from '../assets/DoctorImage.png';
import DatePick from '../components/User/DatePicker';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DoctorCard from '../components/User/DoctorCard';
import ConfirmAppointment from '../components/User/ConfirmAppointment';
import DatePickSpeciality from '../components/User/DatePickSpeciality';
import ConfirmAppointmentSpeciality from '../components/User/ConfirmAppointmentSpeciality';

export default function DashBoard() {
  const { Search } = Input;
  const [doctorList, setDoctorList] = useState([]);
  const [displayedDoctors, setDisplayedDoctors] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // Thêm state để lưu trữ ID của bác sĩ đã chọn
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotId, setSlotId] = useState(null); // Thêm state để lưu trữ ID của slot đã chọn
  const [continueClicked, setcontinueClicked] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  useEffect(() => {
    axios.get('user/getAllDoctors')
      .then(response => {
        const doctors = response.data.doctors;
        setDoctorList(doctors);
        setDisplayedDoctors(doctors);
      })
      .catch(error => {
        console.error('Error fetching doctor list:', error);
      });

    axios.get('user/getAllDepartments')
      .then(response => {
        const departments = response.data.data;
        setSpeciality(departments);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });

  }, []);

  const handleSearch = (value) => {
    const filteredDoctors = doctorList.filter(doctor => doctor.name.toLowerCase().includes(value.toLowerCase()));
    setDisplayedDoctors(filteredDoctors);
  };

  const handleSelect = (value) => {
    if (value === 'all') {
      setDisplayedDoctors(doctorList);
    } else {
      const filteredDoctors = doctorList.filter(doctor => doctor.department === value);
      setDisplayedDoctors(filteredDoctors);
    }
    setSelectedSpeciality(value);
    setSelectedDoctorId(null); // Reset ID của bác sĩ khi chọn chuyên khoa khác
    setcontinueClicked(false); // Reset trạng thái xác nhận cuộc hẹn
    
  }

  const handleBooking = (doctorId) => () => {
    setSelectedDoctorId(doctorId); // Lưu trữ ID của bác sĩ được chọn để reload DatePick
    setcontinueClicked(false); // Reset trạng thái xác nhận cuộc hẹn
  };
  const handleContinue = (doctorId, selectedDate, selectedSlot, slotId) => {
    setSelectedDate(selectedDate);
    setSelectedSlot(selectedSlot);
    setcontinueClicked(true);
    setSlotId(slotId)
  };
  const handleContinueSpeciality = (selectedDate, selectedSlot) => {
    console.log(selectedDate, selectedSlot);
    console.log(selectedSpeciality);
    setSelectedDate(selectedDate);
    setSelectedSlot(selectedSlot);
    setcontinueClicked(true);

  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4 ">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="Search doctors"
              allowClear
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ marginRight: '16px' }}
            />
            <Select placeholder="Book by speciality" style={{ width: 200 }} size='large' onSelect={handleSelect}>
              {speciality.map(department => (
                <Select.Option key={department._id} value={department.name}>
                  {department.name}
                </Select.Option>
              ))}
              <Select.Option value="all">All</Select.Option>
            </Select>
          </div>
          {displayedDoctors.length === 0 && (
            <p className="text-lg mt-4 text-center">No doctors found</p>
          )}
          <div style={{
            overflowY: 'auto', maxHeight: '500px', scrollBehavior: 'smooth',
            scrollbarWidth: 'thin', scrollbarColor: '#c0c0c0 #f0f0f0'
          }}>
            {displayedDoctors.map(doctor => (
              <DoctorCard key={doctor._id} avatar={doctor.avatar} name={doctor.name} speciality={doctor.department} experience={doctor.experience} onCardClick={() => handleBooking(doctor._id)} />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 p-4 shadow-lg ">
          <h1 className="text-3xl text-center font-bold mb-4">Book an appointment</h1>
          {!continueClicked && selectedDoctorId && (
            <DatePick key={selectedDoctorId} doctor_id={selectedDoctorId} onContinue={handleContinue} />
          )}
          {!continueClicked && !selectedDoctorId && selectedSpeciality && (
            <DatePickSpeciality speciality={selectedSpeciality} onContinue={handleContinueSpeciality}  />
          )}

          {continueClicked && selectedDoctorId && (
            <ConfirmAppointment doctor_id={selectedDoctorId} date={selectedDate} time={selectedSlot} slot_id={slotId} />
          )}
          {continueClicked && !selectedDoctorId && selectedSpeciality && (
            <ConfirmAppointmentSpeciality speciality={selectedSpeciality} date={selectedDate} time={selectedSlot} />
          )
            }
        </div>
      </div>
    </div>
  );
}
