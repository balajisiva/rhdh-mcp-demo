import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

// Use relative URL in production (nginx will proxy), absolute in dev
const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/api/users/${editingId}`
        : `${API_URL}/api/users`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save user');
      
      await fetchUsers();
      setFormData({ name: '', email: '', role: 'User' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', role: 'User' });
    setEditingId(null);
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>👥 User Management Demo</h1>
          <p>Simple demo app with Frontend, Backend, and Client Service</p>
        </header>

        {error && <div className="error">{error}</div>}

        <div className="content">
          <section className="form-section">
            <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="form-actions">
                <button type="submit">{editingId ? 'Update' : 'Add'} User</button>
                {editingId && (
                  <button type="button" onClick={handleCancel}>Cancel</button>
                )}
              </div>
            </form>
          </section>

          <section className="users-section">
            <div className="section-header">
              <h2>Users ({users.length})</h2>
              <button onClick={fetchUsers} className="refresh-btn">🔄 Refresh</button>
            </div>
            
            {loading ? (
              <div className="loading">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="empty">No users found. Add your first user!</div>
            ) : (
              <div className="users-grid">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p className="email">{user.email}</p>
                      <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span>
                    </div>
                    <div className="user-actions">
                      <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
