import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const apiBase = '/api/Employees'; // Base path for API endpoints

export default function App() {
  // State to store employee list
  const [employees, setEmployees] = useState([]);

  // State to track form data
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', salary: '' });

  // State to track if editing an employee (null = adding)
  const [editingId, setEditingId] = useState(null);

  // State to track which employee details are currently visible
  const [visibleDetails, setVisibleDetails] = useState({});

  // Fetch all employees on initial load
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiBase}/GetAllEmployees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Call fetchEmployees once on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update employee if editing
        await axios.put(`${apiBase}/UpdateEmployee/${editingId}`, formData);
      } else {
        // Add new employee
        await axios.post(`${apiBase}/AddEmployee`, formData);
      }
      // Reset form and reload employee list
      setFormData({ name: '', email: '', phone: '', salary: '' });
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Populate form with employee data for editing
  const handleEdit = (emp) => {
    setFormData({ name: emp.name, email: emp.email, phone: emp.phone, salary: emp.salary });
    setEditingId(emp.id); // Track which employee is being edited
    setVisibleDetails((prev) => ({ ...prev, [emp.id]: true })); // Ensure details are shown
  };

  // Delete an employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBase}/DeleteEmployee/${id}`);
      fetchEmployees(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Toggle visibility of employee details
  const toggleDetails = (id) => {
    setVisibleDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container">
      <h1>Employee Portal</h1>

      {/* Employee Add/Update Form */}
      <form onSubmit={handleSubmit} className="employee-form">
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
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Salary"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          required
        />
        <button type="submit">
          {editingId ? 'Update' : 'Add'} Employee
        </button>
      </form>

      {/* List of Employees */}
      <ul className="employee-list">
        {employees.map((emp) => (
          <li key={emp.id} className="employee-card">
            {/* Always show employee name */}
            <p><strong>{emp.name}</strong></p>

            {/* Conditionally show details if toggled */}
            {visibleDetails[emp.id] && (
              <>
                <p>Email: {emp.email}</p>
                <p>Phone: {emp.phone}</p>
                <p>
                  Salary:{' '}
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(emp.salary)}
                </p>

                {/* Action Buttons */}
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(emp)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}

            {/* Toggle Button to Show/Hide Details */}
            <button className="toggle-btn" onClick={() => toggleDetails(emp.id)}>
              {visibleDetails[emp.id] ? 'Hide Details' : 'Show Details'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
