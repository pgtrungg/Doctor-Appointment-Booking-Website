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
