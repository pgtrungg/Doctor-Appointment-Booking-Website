import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import UserDetail from '../User/UserDetail';

const DoctorHome = () => {
  const user = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // State to track selected user id for UserDetail
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      axios.get(`/doctor/getAppointments/${user.doctor_id}`)
        .then(response => {
          const appointmentsData = response.data.data.reverse();
          setAppointments(appointmentsData);

          // Collect unique values for filter options
          const allStatuses = appointmentsData.map(appointment => appointment.status);
          setStatusFilters([...new Set(allStatuses)]);
        })
        .catch(error => {
          console.error('Error fetching appointments:', error);
          toast.error("Something went wrong, unable to retrieve appointments");
        });
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      case 'Cancelled':
        return 'volcano';
      case 'Request for Cancellation':
        return 'orange';
      case 'Failed For Cancellation':
        return 'gold';
      default:
        return 'geekblue';
    }
  };

  const handleAcceptAppointment = (record) => {
    if(record.status === 'Pending') {
    axios.put('/doctor/changeAppointmentStatus/Approved', { appointment_id: record._id })
      .then(response => {
        toast.success("Appointment status updated successfully");
        setAppointments(appointments.map(appointment => {
          if (appointment._id === record._id) {
            return { ...appointment, status: 'Approved' };
          }
          return appointment;
        }));
      })
      .catch(error => {
        console.error('Error cancelling appointment:', error);
        toast.error("Something went wrong, unable to update appointment status");
      });
    } else {
      axios.put('/doctor/handleCancellationRequest/Approved', { appointment_id: record._id })
      .then(response => {
        toast.success("Appointment status updated successfully");
        setAppointments(appointments.map(appointment => {
          if (appointment._id === record._id) {
            return { ...appointment, status: 'Cancelled' };
          }
          return appointment;
        }));
      })
      .catch(error => {
        console.error('Error cancelling appointment:', error);
        toast.error("Something went wrong, unable to update appointment status");
      });
    }
  };
  const handleRejectAppointment = (record) => {
    if(record.status === 'Pending') {
    axios.put('/doctor/changeAppointmentStatus/Rejected', { appointment_id: record._id })
      .then(response => {
        toast.success("Appointment status updated successfully");
        setAppointments(appointments.map(appointment => {
          if (appointment._id === record._id) {
            return { ...appointment, status: 'Rejected' };
          }
          return appointment;
        }));
      })
      .catch(error => {
        console.error('Error cancelling appointment:', error);
        toast.error("Something went wrong, unable to update appointment status");
      });
    } else {
      axios.put('/doctor/handleCancellationRequest/Rejected', { appointment_id: record._id })
      .then(response => {
        toast.success("Appointment status updated successfully");
        setAppointments(appointments.map(appointment => {
          if (appointment._id === record._id) {
            return { ...appointment, status: 'Failed for Cancellation' };
          }
          return appointment;
        }));
      })
      .catch(error => {
        console.error('Error cancelling appointment:', error);
        toast.error("Something went wrong, unable to update appointment status");
      });
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.user_id.email.toLowerCase().includes(searchText.toLowerCase())||
    appointment.user_id.name.toLowerCase().includes(searchText.toLowerCase()) ||
    appointment.user_id.phone.toLowerCase().includes(searchText.toLowerCase()) 
  );
  const handleNameClick = (record) => {
    console.log('Name clicked:', record);
    setSelectedUserId(record.user_id._id); // Set selected user id for displaying UserDetail
    setIsDetailVisible(true); // Show UserDetail modal
  };
  const handleDetailClose = () => {
    setIsDetailVisible(false); // Close UserDetail modal
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: ['user_id', 'name'],
      key: 'name',
      render: (text, record) => (
        <span
          className="cursor-pointer hover:text-blue-500"
          onClick={() => handleNameClick(record)}
        >
          {text}
        </span>
      ),
      
      
    },
    {
      title: 'Email',
      dataIndex: ['user_id', 'email'],
      key: 'email',
    },
    {
      title: 'Date',
      dataIndex: ['slot_id', 'date'],
      key: 'date',
      sorter: (a, b) => new Date(a.slot_id.date) - new Date(b.slot_id.date),
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: notes => (
        <Tooltip title={notes}>
          <span>{notes.length > 50 ? `${notes.substring(0, 50)}...` : notes}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters.map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.status.includes(value),
      render: status => {
        if (!status) return null;
        const color = getStatusColor(status);
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        (record.status === 'Pending' || record.status === 'Request for Cancellation') && (
          <>
            <Button
              onClick={() => handleAcceptAppointment(record)}
              icon={<CheckOutlined />}
              className="py-1 px-3 rounded"
              style={{ border: 'none', background: 'transparent', color: '#1890ff' }}
              // hover màu xanh
              ghost
            />
            <Button
              onClick={() => handleRejectAppointment(record)}
              icon={<CloseOutlined />}
              className="py-1 px-3 rounded"
              style={{ border: 'none', background: 'transparent', color: '#ff4d4f' }}
              // hover màu đỏ
              ghost
            />
          </>
        )
      ),
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 pb-2 pt-4">
        My Appointments
      </h1>
      <div className="search-bar mb-4">
        <Input
          placeholder="Search by email, name, phone number"
          value={searchText}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          className="border-2 border-gray-300 rounded-md py-2 px-4"
        />
      </div>
      <div className="appointment-table p-4">
        <Table columns={columns} dataSource={filteredAppointments} rowKey="_id" size="small" />
      </div>
      {selectedUserId && (
      <UserDetail
        userId={selectedUserId}
        visible={isDetailVisible}
        onClose={handleDetailClose}
      />
    )}
    </div>
  );
};

export default DoctorHome;
