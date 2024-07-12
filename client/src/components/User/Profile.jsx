import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Avatar from '../../assets/Avatar.png';
import { Modal, Button, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/userSlice';

const { Option } = Select;

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const userId = user._id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    status: '',
    avatar: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    healthInsuranceNumber: '',
    medicalHistory: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    axios.get(`/user/profile/${userId}`)
      .then((response) => {
        const data = response.data.data;
        if (data.dateOfBirth) {
          data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];
        }
        setFormData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        toast.error('Failed to fetch profile data');
        setIsLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/user/updateProfile`, { ...formData, userId })
      .then((response) => {
        setFormData(response.data);
        toast.success('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
      });
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalVisible(true);
  };

  const handleDeleteAccount = () => {
    setIsDeleteAccountModalVisible(true);
  };

  const handleCancelChangePassword = () => {
    setIsChangePasswordModalVisible(false);
  };

  const handleCancelDeleteAccount = () => {
    setIsDeleteAccountModalVisible(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handlePasswordSubmit = () => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    axios.put(`/user/changePassword`, { oldPassword, newPassword, userId })
      .then(() => {
        toast.success('Password changed successfully');
      })
      .catch((error) => {
        console.error('Error changing password:', error);
        toast.error('Failed to change password');
      });
    setIsChangePasswordModalVisible(false);
  };

  const submitDeleteAccount = () => {
    axios.delete(`/user/deleteAccount/${userId}`)
      .then(() => {
        toast.success('Account deleted successfully');
        navigate('/');
        dispatch(logout());
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      });
    setIsDeleteAccountModalVisible(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="max-w-5xl mx-auto my-3 p-3 bg-white shadow-md rounded-md flex">
        <div className="flex items-center">
          <div className="-mt-2 -ml-2">
            <img src={Avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p className="text-gray-600">{formData.email}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mr-4"
          >
            Change Password
          </button>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Delete Account
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto my-3 p-3 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
                disabled
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Phone:</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Address:</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Date of Birth:</label>
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Blood Group:</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="block text-gray-700">Health Insurance Number:</label>
              <input
                name="healthInsuranceNumber"
                value={formData.healthInsuranceNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="w-full px-2 mb-4">
              <label className="block text-gray-700">Medical History:</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-3/5 mx-auto block px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Update Profile
          </button>

        </form>
      </div>

      <Modal
        title="Change Password"
        visible={isChangePasswordModalVisible}
        onCancel={handleCancelChangePassword}
        footer={[
          <Button key="submit" type="primary" onClick={handlePasswordSubmit}>
            Change Password
          </Button>,
          <Button key="cancel" onClick={handleCancelChangePassword}>
            Cancel
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[{ required: true, message: 'Please input your old password' }]}
          >
            <Input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
            />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[{ required: true, message: 'Please input your new password' }]}
          >
            <Input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your new password' }]}
          >
            <Input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete Account"
        visible={isDeleteAccountModalVisible}
        onCancel={handleCancelDeleteAccount}
        footer={[
          <Button key="delete" type="primary" danger onClick={submitDeleteAccount}>
            Delete Account
          </Button>
          ,
          <Button key="cancel" onClick={handleCancelDeleteAccount}>
            Cancel
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete your account?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Profile;
