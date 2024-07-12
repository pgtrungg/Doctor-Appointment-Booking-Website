import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Modal } from 'antd';
import axios from 'axios';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import AddDoctor from './AddDoctor';
import DoctorDetail from './DoctorDetails';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [isAddDoctorModalVisible, setIsAddDoctorModalVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isDoctorDetailModalVisible, setIsDoctorDetailModalVisible] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('/admin/getAllDoctors');
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleAddDoctor = () => {
        setIsAddDoctorModalVisible(true);
    };

    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchText(value);
    };

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
    };

    const handleAddDoctorModalCancel = () => {
        setIsAddDoctorModalVisible(false);
    };

    const handleDoctorDetailModalCancel = () => {
        setIsDoctorDetailModalVisible(false);
        setSelectedDoctor(null);
    };

    const handleRowClick = (record) => {
        setSelectedDoctor(record);
        setIsDoctorDetailModalVisible(true);
    };

    const handleUpdateDoctor = async (doctor) => {
        try {
            // Refresh the doctor list
            fetchDoctors();
        } catch (error) {
            console.error('Error updating doctor:', error);
            toast.error('Failed to update doctor');
        }
        // Close the modal after update
        setIsDoctorDetailModalVisible(false);
    };

    const handleDeleteDoctor = async (doctorId) => {
        try {
            await axios.delete(`/admin/deleteDoctor/${doctorId}`);
            toast.success('Doctor deleted successfully');
            // Refresh the doctor list
            fetchDoctors();
        } catch (error) {
            console.error('Error deleting doctor:', error);
            toast.error('Failed to delete doctor');
        }
        // Close the modal after deletion
        setIsDoctorDetailModalVisible(false);
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const { name, email, phone, department } = doctor;
        const lowerSearchText = searchText.toLowerCase();
        return (
            (name.toLowerCase().includes(lowerSearchText) ||
                email.toLowerCase().includes(lowerSearchText) ||
                phone.includes(searchText)) &&
            (selectedDepartment === '' || department === selectedDepartment)
        );
    });

    const departments = Array.from(new Set(doctors.map(doctor => doctor.department)));

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            filters: departments.map(department => ({ text: department, value: department })),
            onFilter: (value, record) => record.department === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button
                    type="link"
                    icon={<DeleteOutlined style={{ color: 'red' }} />}
                    onClick={() => handleDeleteDoctor(record._id)}
                    style={{ color: 'red' }}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-extrabold mb-3 text-center text-gray-800 pb-2 pt-4">
                Doctor Management
            </h1>
            <div className="mb-1 ms-3 flex justify-between">
                <div>
                    <Button type="primary" onClick={handleAddDoctor} icon={<PlusOutlined />} style={{ verticalAlign: 'middle' }}>
                        Add Doctor
                    </Button>
                </div>
                <div className="flex items-center">
                    <Input.Search
                        allowClear
                        placeholder="Search by name, email, or phone"
                        onChange={handleSearch} // Sử dụng onChange thay vì onSearch
                        style={{ width: 600, marginRight: 60 }}
                    />
                </div>
            </div>
            <Table
                dataSource={filteredDoctors}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />

            {/* Add Doctor Modal */}
            <AddDoctor
                visible={isAddDoctorModalVisible}
                onCancel={handleAddDoctorModalCancel}
                fetchDoctors={fetchDoctors} // Pass the fetchDoctors function to update the list
            />

            {/* Doctor Detail Modal */}
            <DoctorDetail
                visible={isDoctorDetailModalVisible}
                onCancel={handleDoctorDetailModalCancel}
                doctor={selectedDoctor}
                onUpdate={handleUpdateDoctor}
                onDelete={handleDeleteDoctor}
            />
        </div>
    );
};

export default Doctor;

