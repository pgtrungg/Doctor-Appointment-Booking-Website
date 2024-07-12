/* import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const DatePick = ({ doctor_id, onContinue }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateList, setDateList] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotId, setSlotId] = useState(null);

  useEffect(() => {
    axios.get(`/user/getDateListDoctor/${doctor_id}`)
      .then(response => {
        const dates = response.data.data.map(dateString => new Date(dateString));
        setDateList(dates);

      })
      .catch(error => {
        console.error('Error fetching date list:', error);
      });
  }, [doctor_id]);

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const handleDateClick = (index) => {
    const selectedDay = new Date(currentDate);
    selectedDay.setDate(currentDate.getDate() - currentDate.getDay() + index);
    setSelectedDate(selectedDay);
    setSelectedSlot(null); // Reset selected slot when changing the date

    const formattedDate = selectedDay.toISOString().split('T')[0];

    axios.get(`/user/getSlotsByDoctor/${doctor_id}`, { params: { date: formattedDate } })
      .then(response => {
        setSlots(response.data.data.time);
        setSlotId(response.data.data._id);
      })
      .catch(error => {
        console.error('Error fetching slots:', error);
      });
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const Slot = ({ slots }) => {
    return (
      <div className="w-full">
        {slots.map((slot, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedSlot(slot)}
            className={`rounded-full m-2 px-4 py-2 border font-bold ${selectedSlot === slot ? 'bg-blue-500 text-white' : ''}`}
          >
            <span>{slot}</span>
          </button>
        ))}
      </div>
    );
  };

  const getDateFromIndex = (index) => {
    const result = new Date(currentDate);
    result.setDate(currentDate.getDate() - currentDate.getDay() + index);
    return result;
  };

  const onClickNext = () => {
    if (selectedDate && selectedSlot) {
      onContinue(doctor_id, selectedDate.toISOString().split('T')[0], selectedSlot, slotId);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="flex flex-col">
        <div className="self-start text-[#86899B] my-2 font-bold">Date</div>
        <div className="flex w-full justify-between md:px-2 overflow-auto">
          <button type="button" className="ant-btn css-1kq9k6q ant-btn-default sc-ddjGPC iLzvky md:w-12 w-7 mr-1 sticky left-0 z-10 p-2 bg-white" onClick={handlePrevWeek}>
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.20711 13.7071C7.81658 14.0976 7.18342 14.0976 6.79289 13.7071L0.792893 7.70711C0.402369 7.31658 0.402369 6.68342 0.792894 6.29289L6.79289 0.292892C7.18342 -0.0976316 7.81658 -0.0976315 8.20711 0.292892C8.59763 0.683417 8.59763 1.31658 8.20711 1.70711L2.91421 7L8.20711 12.2929C8.59763 12.6834 8.59763 13.3166 8.20711 13.7071Z" fill="#808089"></path>
            </svg>
          </button>
          <div className="flex justify-center gap-1">
            {days.map((day, index) => {
              const dayOfWeek = getDateFromIndex(index);
              const dayOfMonth = dayOfWeek.getDate();
              const month = dayOfWeek.getMonth() + 1;
              const isDisabled = dayOfWeek <= new Date().setHours(23, 59, 59, 0) || !dateList.some(date => isSameDay(date, dayOfWeek));

              return (
                <button
                  key={index}
                  type="button"
                  className={`border md:w-16 w-12 ${isDisabled ? 'text-gray-300 cursor-not-allowed' : ''} ${selectedDate && isSameDay(getDateFromIndex(index), selectedDate) && !isDisabled ? 'bg-blue-500 text-white' : 'bg-white text-black'} p-2 rounded-md`}
                  disabled={isDisabled}
                  onClick={() => handleDateClick(index)}
                >
                  <div className="flex flex-col">
                    <span className={`font-blod text-sm ${selectedDate && isSameDay(getDateFromIndex(index), selectedDate) && !isDisabled ? 'text-white' : ''}`}>{day}</span>
                    <span className={`font-bold text-sm ${selectedDate && isSameDay(getDateFromIndex(index), selectedDate) && !isDisabled ? 'text-white' : ''}`}>{`${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}/${month < 10 ? '0' + month : month}`}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <button type="button" className="ant-btn css-1kq9k6q ant-btn-default sc-ddjGPC iLzvky md:w-12 w-7 ml-1 sticky right-0 z-10 p-2 bg-white" onClick={handleNextWeek}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 8 14">
              <path opacity="0.5" d="M7.2829 6.53603L1.56571 0.691905C1.31484 0.436032 0.9084 0.436032 0.6569 0.691905C0.406033 0.947779 0.406033 1.36338 0.6569 1.61926L5.92061 6.99968L0.657533 12.3801C0.406667 12.636 0.406667 13.0516 0.657533 13.3081C0.9084 13.564 1.31548 13.564 1.56634 13.3081L7.28353 7.46397C7.5306 7.21074 7.5306 6.78861 7.2829 6.53603Z"></path>
            </svg>
          </button>
        </div>
        <div className="max-h-[250px]  pr-2 mt-4">
          {slots.length !== 0 && (
            <div>
              <div className="text-[#86899B] my-2 font-bold">Time</div>
              <Slot slots={slots} />

            </div>
          )}

        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: '8rem',
          height: '3rem',
          marginTop: '1rem',
          borderRadius: '0.5rem'
        }}
        onClick={onClickNext}
        disabled={!selectedDate || !selectedSlot}
      >
        Continue
      </Button>
    </div>
  );
};

export default DatePick;


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const DatePickSpeciality = ({ speciality, onContinue }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateList, setDateList] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotId, setSlotId] = useState(null);

  useEffect(() => {
    if (speciality) {
      axios.get(`/user/getDateListDepartment/${speciality}`)
        .then(response => {
          const dates = response.data.data.map(dateString => new Date(dateString));
          setDateList(dates);
        })
        .catch(error => {
          console.error('Error fetching date list:', error);
        });
    }
  }, [speciality]);

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const handleDateClick = (index) => {
    const selectedDay = new Date(currentDate);
    selectedDay.setDate(currentDate.getDate() - currentDate.getDay() + index);
    setSelectedDate(selectedDay);
    setSelectedSlot(null); // Reset selected slot when changing the date

    const formattedDate = selectedDay.toISOString().split('T')[0];

    axios.get(`/user/getSlotsByDepartment/${speciality}/${formattedDate}`)
      .then(response => {
        console.log(response.data.data);
        setSlots(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching slots:', error);
      });
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const Slot = ({ slots }) => {
    return (
      <div className="w-full">
        {slots.map((slot, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedSlot(slot)}
            className={`rounded-full m-2 px-4 py-2 border font-bold ${selectedSlot === slot ? 'bg-blue-500 text-white' : ''}`}
          >
            <span>{slot}</span>
          </button>
        ))}
      </div>
    );
  };

  const getDateFromIndex = (index) => {
    const result = new Date(currentDate);
    result.setDate(currentDate.getDate() - currentDate.getDay() + index);
    return result;
  };

  const onClickNext = () => {
    if (selectedDate && selectedSlot) {
      onContinue(selectedDate.toISOString().split('T')[0], selectedSlot);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="flex flex-col">
        <div className="self-start text-[#86899B] my-2 font-bold">Date</div>
        <div className="flex w-full justify-between md:px-2 overflow-auto">
          <button type="button" className="ant-btn css-1kq9k6q ant-btn-default sc-ddjGPC iLzvky md:w-12 w-7 mr-1 sticky left-0 z-10 p-2 bg-white" onClick={handlePrevWeek}>
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.20711 13.7071C7.81658 14.0976 7.18342 14.0976 6.79289 13.7071L0.792893 7.70711C0.402369 7.31658 0.402369 6.68342 0.792894 6.29289L6.79289 0.292892C7.18342 -0.0976316 7.81658 -0.0976315 8.20711 0.292892C8.59763 0.683417 8.59763 1.31658 8.20711 1.70711L2.91421 7L8.20711 12.2929C8.59763 12.6834 8.59763 13.3166 8.20711 13.7071Z" fill="#808089"></path>
            </svg>
          </button>
          <div className="flex justify-center gap-1">
            {days.map((day, index) => {
              const dayOfWeek = getDateFromIndex(index);
              const dayOfMonth = dayOfWeek.getDate();
              const month = dayOfWeek.getMonth() + 1;
              const isDisabled = dayOfWeek <= new Date().setHours(23, 59, 59, 0) || !dateList.some(date => isSameDay(date, dayOfWeek));

              return (
                <button
                  key={index}
                  type="button"
                  className={`border md:w-16 w-12 ${isDisabled ? 'text-gray-300 cursor-not-allowed' : ''} ${selectedDate && isSameDay(getDateFromIndex(index), selectedDate) && !isDisabled ? 'bg-blue-500 text-white' : 'bg-white text-black'} p-2 rounded-md`}
                  disabled={isDisabled}
                  onClick={() => handleDateClick(index)}
                >
                  <div className="flex flex-col">
                    <span className={`font-blod text-sm ${selectedDate && isSameDay(getDateFromIndex(index), selectedDate) && !isDisabled ? 'text-white' : ''}`}>{day}</span>
                    <span className={`font-bold text-sm ${selectedDate && isSameDay(getDateFromIndex(index), selectedDate) && !isDisabled ? 'text-white' : ''}`}>{`${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}/${month < 10 ? '0' + month : month}`}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <button type="button" className="ant-btn css-1kq9k6q ant-btn-default sc-ddjGPC iLzvky md:w-12 w-7 ml-1 sticky right-0 z-10 p-2 bg-white" onClick={handleNextWeek}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 8 14">
              <path opacity="0.5" d="M7.2829 6.53603L1.56571 0.691905C1.31484 0.436032 0.9084 0.436032 0.6569 0.691905C0.406033 0.947779 0.406033 1.36338 0.6569 1.61926L5.92061 6.99968L0.657533 12.3801C0.406667 12.636 0.406667 13.0516 0.657533 13.3081C0.9084 13.564 1.31548 13.564 1.56634 13.3081L7.28353 7.46397C7.5306 7.21074 7.5306 6.78861 7.2829 6.53603Z"></path>
            </svg>
          </button>
        </div>
        <div className="max-h-[250px]  pr-2 mt-4">
          {slots.length !== 0 && (
            <div>
              <div className="text-[#86899B] my-2 font-bold">Time</div>
              <Slot slots={slots} />
            </div>
          )}
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: '8rem',
          height: '3rem',
          marginTop: '1rem',
          borderRadius: '0.5rem'
        }}
        onClick={onClickNext}
        disabled={!selectedDate || !selectedSlot}
      >
        Continue
      </Button>
    </div>
  );
};

export default DatePickSpeciality;

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const AddDoctor = ({ visible, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null); // State để lưu tệp avatar
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    dateOfBirth: '',
    password: '',
    experience: '',
    department: '',
    avatar: null, // Đổi thành null để sử dụng null làm giá trị mặc định
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setFormData({ ...formData, avatar: file }); // Cập nhật formData với file avatar mới
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.address || !formData.dateOfBirth || !formData.password || !formData.experience || !formData.department || !avatarFile) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('gender', formData.gender);
    data.append('address', formData.address);
    data.append('dateOfBirth', formData.dateOfBirth);
    data.append('password', formData.password);
    data.append('experience', formData.experience);
    data.append('department', formData.department);
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    try {
      await axios.post('/admin/addDoctor', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Doctor added successfully');
      onCancel(); // Đóng modal sau khi thêm thành công
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        dateOfBirth: '',
        password: '',
        experience: '',
        department: '',
        avatar: null, // Reset avatar về null sau khi thêm thành công
      });
      setAvatarFile(null); // Reset avatarFile về null sau khi thêm thành công
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onCancel(); // Đóng modal
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: '',
      address: '',
      dateOfBirth: '',
      password: '',
      experience: '',
      department: '',
      avatar: null, // Reset avatar về null khi đóng modal
    });
    setAvatarFile(null); // Reset avatarFile về null khi đóng modal
  };

  return (
    <Modal
      visible={visible} // Ensure modal visibility is controlled
      onCancel={handleClose}
      footer={null}
      width={1200}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 pb-2 pt-4">
        Add Doctor
      </h1>
      <div className='flex flex-wrap -mx-2'>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Experience:</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Avatar:</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>
        <div className="flex justify-center">
          <Button type="primary" htmlType="submit" loading={loading} onClick={handleSubmit}>
            {loading ? 'Adding...' : 'Add Doctor'}
          </Button>
          <Button className="ml-4" onClick={handleClose}>
            Cancel
          </Button>
        </div>
   
    </Modal>
  );
};

export default AddDoctor;

 */