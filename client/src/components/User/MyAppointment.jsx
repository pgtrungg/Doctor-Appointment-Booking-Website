import React, { useEffect, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyAppointment = () => {
  const user = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [doctorFilters, setDoctorFilters] = useState([]);
  const [departmentFilters, setDepartmentFilters] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);

  useEffect(() => {
    axios.get(`/user/getMyAppointments/${user._id}`)
      .then(response => {
        setAppointments(response.data.data.reverse());
        // Collect unique values for filter options
        const allDoctors = response.data.data.map(appointment => appointment.doctor_id.name);
        const allDepartments = response.data.data.map(appointment => appointment.doctor_id.department);
        const allStatuses = response.data.data.map(appointment => appointment.status);
        const uniqueDoctors = Array.from(new Set(allDoctors));
        const uniqueDepartments = Array.from(new Set(allDepartments));
        const uniqueStatuses = Array.from(new Set(allStatuses));
        setDoctorFilters(uniqueDoctors);
        setDepartmentFilters(uniqueDepartments);
        setStatusFilters(uniqueStatuses);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        toast.error("Something went wrong, unable to retrieve appointments");
      });
  }, [user._id]);

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

  const columns = [
    {
        title: 'Doctor',
        dataIndex: ['doctor_id', 'name'],
        key: 'doctor',
        filters: doctorFilters.map(doctor => ({ text: `Dr. ${doctor}`, value: doctor })),
        onFilter: (value, record) => record.doctor_id.name.indexOf(value) === 0,
        sorter: (a, b) => a.doctor_id.name.localeCompare(b.doctor_id.name),
        render: (name) => `Dr. ${name}`,
      },
    {
      title: 'Department',
      dataIndex: ['doctor_id', 'department'],
      key: 'department',
      filters: departmentFilters.map(department => ({ text: department, value: department })),
      onFilter: (value, record) => record.doctor_id.department.indexOf(value) === 0,
      sorter: (a, b) => a.doctor_id.department.localeCompare(b.doctor_id.department),
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
      dataIndex: ['time'],
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: ['status'],
      key: 'status',
      filters: statusFilters.map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.status.indexOf(value) === 0,
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
          (record.status === 'Pending' || record.status === 'Approved') && (
            <Button
              onClick={() => handleCancelAppointment(record)}
              style={{ backgroundColor: '#e53e3e', color: 'white' }}
              className="py-1 px-3 rounded"
            >
              Cancel
            </Button>
          )
        ),
      },
  ];

  const handleCancelAppointment = (record) => {
    axios.put('/user/cancelAppointment', { appointment_id: record._id })
      .then(response => {
        toast.success("Appointment status updated successfully");
        setAppointments(appointments.map(appointment => {
          if (appointment._id === record._id) {
            if (record.status === 'Approved') {
              appointment.status = 'Request for Cancellation';
            } else {
              appointment.status = 'Cancelled';
            }
          }
          return appointment;
        }));
      })
      .catch(error => {
        console.error('Error cancelling appointment:', error);
        toast.error("Something went wrong, unable to update appointment status");
      });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 pb-2 pt-4">
        My appointments
      </h1>
      <div className="appointment-table p-4">
        <Table columns={columns} dataSource={appointments} rowKey="_id" size="small" />
      </div>
    </div>
  );
};

export default MyAppointment;
