import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment-timezone'; // Import moment-timezone

const AddSlot = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const user = useSelector((state) => state.user);
  const doctor_id = user.doctor_id;
  const defaultSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
  const [currentDate, setCurrentDate] = useState(moment()); // Sử dụng moment thay cho new Date()
  const [selectedDate, setSelectedDate] = useState(); // Sửa đổi ở đây
  const [dateList, setDateList] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(defaultSlots);
  const [isDateSelected, setIsDateSelected] = useState(false); // Thêm biến này

  useEffect(() => {
    axios.get(`/user/getDateListDoctor/${doctor_id}`)
      .then(response => {
        const dates = response.data.data.map(dateString => moment(dateString));
        setDateList(dates);

      })
      .catch(error => {
        console.error('Error fetching date list:', error);
      });
  }, [doctor_id]);

  const handlePrevWeek = () => {
    const prevWeek = moment(currentDate).subtract(7, 'days'); // Sử dụng moment để tính toán ngày
    setCurrentDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = moment(currentDate).add(7, 'days'); // Sử dụng moment để tính toán ngày
    setCurrentDate(nextWeek);
  };

  const handleDateClick = (index) => {
    const selectedDay = getDateFromIndex(index);
    setSelectedDate(selectedDay);
    setSelectedSlot(defaultSlots); // Reset selected slot when changing the date
    setIsDateSelected(true); // Cập nhật biến này khi người dùng chọn ngày
  };

  const isSameDay = (date1, date2) => {
    return date1.isSame(date2, 'day'); // Sử dụng moment để so sánh ngày
  };

  const Slot = () => {
    return (
      <div className="w-full">
        {defaultSlots.map((slot, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`rounded-full m-2 px-4 py-2 border font-bold ${selectedSlot.includes(slot) ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handleClickSlot(slot)}
            >
              <span>{slot}</span>
            </button>
          );
        }
        )}
      </div>
    );
  };

  const handleClickSlot = (slot) => {
    if (selectedSlot.includes(slot)) {
      setSelectedSlot(selectedSlot.filter((item) => item !== slot));
    } else {
      setSelectedSlot([...selectedSlot, slot]);
    }
  };

  const getDateFromIndex = (index) => {
    const result = moment(currentDate).startOf('week').add(index, 'days'); // Sử dụng moment để tính toán ngày
    return result;
  };

  const onClickNext = () => {
    if (isDateSelected) { // Sử dụng biến này để kiểm tra
      axios.post('/doctor/createSlots', { doctor_id, date: selectedDate.toISOString(), time: selectedSlot })
        .then(response => {
          toast.success('Slot created successfully');
          // reset datelist and selected date
          setDateList([...dateList, selectedDate]);
          setSelectedDate(null);
          setIsDateSelected(false);
          setSelectedSlot(defaultSlots);
        })
        .catch(error => {
          console.error('Error creating slot:', error);
          toast.error('Failed to create slot');
        });
    } else {
      toast.error('Please select a date');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded shadow-md">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">Register Working Time</h2>

        {/* Date */}
        <div className="self-start text-[#86899B] my-2 font-bold">Date</div>
        <div className="flex w-full justify-center md:px-2 overflow-auto">
          <button type="button" className="ant-btn css-1kq9k6q ant-btn-default sc-ddjGPC iLzvky md:w-12 w-7 mr-1 sticky left-0 z-10 p-2 bg-white" onClick={handlePrevWeek}>
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.20711 13.7071C7.81658 14.0976 7.18342 14.0976 6.79289 13.7071L0.792893 7.70711C0.402369 7.31658 0.402369 6.68342 0.792894 6.29289L6.79289 0.292892C7.18342 -0.0976316 7.81658 -0.0976315 8.20711 0.292892C8.59763 0.683417 8.59763 1.31658 8.20711 1.70711L2.91421 7L8.20711 12.2929C8.59763 12.6834 8.59763 13.3166 8.20711 13.7071Z" fill="#808089"></path>
            </svg>
          </button>
          <div className="flex justify-center gap-1">
            {days.map((day, index) => {
              const dayOfWeek = getDateFromIndex(index);
              const dayOfMonth = dayOfWeek.date();
              const month = dayOfWeek.month() + 1;
              const isDisabled = dayOfWeek.isBefore(moment().endOf('day')) || dateList.some(date => isSameDay(date, dayOfWeek));

              return (
                <button
                  key={index}
                  type="button"
                  className={`border md:w-16 w-12 ${isDisabled ? 'text-gray-300 cursor-not-allowed' : ''} ${selectedDate && isSameDay(dayOfWeek, selectedDate) && !isDisabled ? 'bg-blue-500 text-white' : 'bg-white text-black'} p-2 rounded-md`}
                  disabled={isDisabled}
                  onClick={() => handleDateClick(index)}
                >
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${selectedDate && isSameDay(dayOfWeek, selectedDate) && !isDisabled ? 'text-white' : ''}`}>{day}</span>
                    <span className={`font-bold text-sm ${selectedDate && isSameDay(dayOfWeek, selectedDate) && !isDisabled ? 'text-white' : ''}`}>{`${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}/${month < 10 ? '0' + month : month}`}</span>
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
        <div className="max-h-[250px] overflow-auto pr-2 mt-4">
          <div>
            <div className="text-[#86899B] my-2 font-bold">Time</div>
            <Slot />
          </div>
        </div>
        <div className="flex justify-center"> {/* Thêm div này để căn giữa nút "Submit" */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: '8rem',
              height: '3rem',
              marginTop: '3rem',
              borderRadius: '0.5rem'
            }}
            onClick={onClickNext}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddSlot;
