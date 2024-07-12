import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const DoctorDetail = ({ visible, onCancel, doctor, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    dateOfBirth: '',
    experience: '',
    department: '',
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        ...doctor,
        dateOfBirth: doctor.dateOfBirth ? dayjs(doctor.dateOfBirth).format('YYYY-MM-DD') : '',
      });
    }
  }, [doctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      // Validate form data
      if (!validateFormData()) {
        return;
      }

      setLoading(true);

      // Prepare data for update
      const dataToUpdate = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? dayjs(formData.dateOfBirth).format('YYYY-MM-DD') : '',
      };

      // Make API call to update doctor
      console.log('Data to update:', dataToUpdate);
      const response = await axios.put(`/admin/updateDoctor/${doctor._id}`, dataToUpdate);
      if (response.status === 200) {
        toast.success('Doctor updated successfully');
        onUpdate(); // Trigger parent component update
      } else {
        toast.error('Failed to update doctor');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Failed to update doctor');
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = () => {
    // Basic validation, you can enhance this as per your requirements
    if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.address || !formData.dateOfBirth || !formData.experience || !formData.department) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleClose = () => {
    onCancel(); // Close modal
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: '',
      address: '',
      dateOfBirth: '',
      experience: '',
      department: '',
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={[
        <Button key="save" type="primary" onClick={handleUpdate} loading={loading}>
          Save
        </Button>,
        <Button key="close" onClick={handleClose}>
          Close
        </Button>,
      ]}
      width={1200}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 pb-2 pt-4">
        Doctor Details
      </h1>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
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
          />
        </div>
        <div className="w-full sm:w-1/3 px-2 mb-4">
          <label className="block text-gray-700">Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth || (doctor && dayjs(doctor.dateOfBirth).format('YYYY-MM-DD'))}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
          />
        </div>
      </div>
    </Modal>
  );
};

export default DoctorDetail;
