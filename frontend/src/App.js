import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserForm from './components/UserForm.js';
import UserList from './components/UserList.js';
import './App.css';

const API_URL = 'http://localhost:5000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async (userData) => {
    try {
      await axios.post(API_URL, userData);
      fetchUsers();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await axios.put(`${API_URL}/${id}`, userData);
      fetchUsers();
      setEditingUser(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">User Management System</h1>
          
          {!showForm ? (
            <button 
              className="btn btn-primary mb-3"
              onClick={() => setShowForm(true)}
            >
              Add New User
            </button>
          ) : (
            <UserForm
              user={editingUser}
              onSubmit={editingUser ? updateUser : createUser}
              onCancel={handleCancel}
            />
          )}

          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={deleteUser}
          />
        </div>
      </div>
    </div>
  );
}

export default App;