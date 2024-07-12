import React, { useEffect, useState } from 'react';
import { Table, Input, Button } from 'antd';
import axios from 'axios';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDetail from '../User/UserDetail'; // Ensure the correct import path for UserDetail

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  useEffect(() => {
    // Fetch users data from backend when component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/getAllUsers');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = (value) => {
    // Handle search when user inputs text in search bar
    setSearchText(value);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/admin/deleteUser/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleRowClick = (record) => {
    setSelectedUserId(record._id);
    setIsDetailVisible(true);
  };

  const handleDetailClose = () => {
    setIsDetailVisible(false);
  };

  const filteredUsers = users.filter((user) => {
    const { name, email, phone } = user;
    const lowerSearchText = searchText.toLowerCase();
    return (
      (name && name.toLowerCase().includes(lowerSearchText)) ||
      (email && email.toLowerCase().includes(lowerSearchText)) ||
      (phone && phone.includes(searchText))
    );
  });

  const genders = Array.from(new Set(users.map(user => user.gender)));

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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: genders.map(gender => ({ text: gender, value: gender })),
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (dateOfBirth) => new Date(dateOfBirth).toLocaleDateString(), // Format date using toLocaleDateString
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined style={{ color: 'red' }} />}
          onClick={() => handleDelete(record._id)}
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
        User Management
      </h1>
      <div className="mb-1 ms-10 flex justify-between">
        <div className="flex items-center">
          <Input
            placeholder="Search by name, email, or phone"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 500, marginRight: '20px' }}
          />
        </div>
      </div>
      <div className="user-table p-4">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          size="small"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
      {selectedUserId && (
        <UserDetail
          userId={selectedUserId}
          visible={isDetailVisible}
          onClose={handleDetailClose} // Use onClose to match the prop in UserDetail
        />
      )}
    </div>
  );
};

export default User;
