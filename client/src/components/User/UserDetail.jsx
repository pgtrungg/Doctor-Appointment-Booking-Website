import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, DatePicker, Form, Select } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const UserDetail = ({ userId, visible, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading when beginning to fetch data
      try {
        const response = await axios.get(`/admin/getUserById/${userId}`);
        console.log('User data:', response.data.user); // Check data returned from API
        setUserData(response.data.user); // Update state with data from API
        setIsLoading(false); // Stop loading when fetch is complete
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error here, e.g., display a toast or error message
        setIsLoading(false); // Stop loading if an error occurs
      }
    };

    fetchUserData();
  }, [userId, visible]); // Add userId and visible to dependency array to rerun useEffect when userId or visible changes

  const handleClose = () => {
    onClose();
  };

  if (isLoading) return <div>Loading...</div>; // Display loading message when fetching data

  if (!userData) return <div>User not found</div>; // Handle case where there is no user data

  return (
    <Modal
      visible={visible} // Ensure modal visibility is controlled
      onCancel={handleClose}
      footer={[
        <Button key="close" onClick={handleClose}>
          Close
        </Button>
      ]}
      width={1200}
    >
      <h1 className="text-3xl font-extrabold mb-3 text-center text-gray-800 pb-2 pt-4">
        User Information
      </h1>
      <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                name="name"
                value={userData.name}

                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                disabled
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                name="email"
                type="email"
                value={userData.email}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                disabled
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Phone:</label>
              <input
                name="phone"
                value={userData.phone}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                disabled
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Address:</label>
              <input
                name="address"
                value={userData.address}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                disabled
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Date of Birth:</label>
          <input
            name="dateOfBirth"
            type="date"
            value={dayjs(userData.dateOfBirth).format('YYYY-MM-DD')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            disabled
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Gender:</label>
          <input
            name="gender"
            value={userData.gender}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            disabled
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Blood Group:</label>
          <input
            name="bloodGroup"
            value={userData.bloodGroup}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            disabled
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Health Insurance Number:</label>
          <input
            name="healthInsuranceNumber"
            value={userData.healthInsuranceNumber}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            disabled
          />
        </div>
        <div className="w-full px-2 mb-4">
          <label className="block text-gray-700">Medical History:</label>
          <textarea
            name="medicalHistory"
            value={userData.medicalHistory}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 custom-textarea"
            rows={3}
            disabled
          />
        </div>
          </div>
    </Modal>
  );
};

export default UserDetail;
