// TaskManager.jsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../store/AuthContext';
import { FaEdit, FaTrash, FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import Table from './Table';

const TaskManager = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    completed: false,
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
        headers: { Authorization: `Token ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const [userPerms, setUserPerms] = useState({});

  const fetchPermissions = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/users/me/permissions/', {
      headers: { Authorization: `Token ${token}` },
    });
    setUserPerms(res.data);
    console.log(res.data)
  };


  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: { Authorization: `Token ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', assigned_to: '', completed: false });
    setEditingTaskId(null);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      assigned_to: task.assigned_to,
      completed: task.completed,
    });
    setEditingTaskId(task.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(`http://127.0.0.1:8000/api/tasks/${editingTaskId}/`, formData, {
          headers: { Authorization: `Token ${token}` },
        });
      } else {
        await axios.post('http://127.0.0.1:8000/api/tasks/', formData, {
          headers: { Authorization: `Token ${token}` },
        });
      }
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save task');
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskToDelete}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.status === 204) {
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
        setModalMessage('Task deleted successfully.');
        setModalStatus('success');
      } else {
        setModalMessage('Failed to delete task.');
        setModalStatus('error');
      }
    } catch (error) {
      if (error.response) {
        setModalMessage(`Error: ${error.response.status} - ${error.response.data?.detail || 'Server error'}`);
      } else if (error.request) {
        setModalMessage('Error: No response from server.');
      } else {
        setModalMessage(`Error: ${error.message}`);
      }
      setModalStatus('error');
    } finally {
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="container mt-4">
      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title text-white">Confirm Deletion</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                  <FaTimes /> Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  <FaTrash /> Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Message Modal */}
      {modalMessage && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${modalStatus === 'success' ? 'bg-success' : 'bg-danger'}`}>
                <h5 className="modal-title text-white">Status</h5>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  className={`btn btn-outline-${modalStatus === 'success' ? 'success' : 'danger'}`}
                  onClick={() => setModalMessage('')}
                >
                  {modalStatus === 'success' ? <FaCheck /> : <FaTimes />} OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2>Task Manager</h2>
      {userPerms.add_task && (
        <button className="btn btn-success mb-3 mt-5" onClick={() => setShowForm(true)}>
          <FaPlus /> Create Task
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 mb-4">
          <div className="mb-2">
            <label>Title</label>
            <input
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <label>Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label>Assign To</label>
            <select
              className="form-select"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              required
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          {editingTaskId !== null && (
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              />
              <label className="form-check-label">Completed</label>
            </div>
          )}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              <FaPlus /> {editingTaskId ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      )}

      <Table
        tasks={tasks}
        users={users}
        userPerms={userPerms}
        handleEdit={handleEdit}
        setTaskToDelete={setTaskToDelete}
        setShowConfirmModal={setShowConfirmModal}
      />
    </div>
  );
};

export default TaskManager;
