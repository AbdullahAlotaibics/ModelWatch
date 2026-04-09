import React from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">
            <span className="logo-icon">📈</span>
            Model Watch
          </div>

          <div className="nav-links">
            <span>Dashboard</span>
            <span className="active">Users</span>
            <span>Categories</span>
            <span>Issues</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <div className="user-name">Admin User</div>
            <div className="user-role">Admin</div>
          </div>
          <button className="logout-btn" onClick={() => navigate("/")}>⇦ Logout</button>
        </div>
      </nav>

      <div className="content">
        <div className="dashboard-header">
          <h1>User Management</h1>
          <p>Manage user accounts, roles, and permissions</p>
        </div>

        <div className="table-card">
          <div className="toolbar">
            <input placeholder="Search users..." />
            <button className="add-btn">+ Add User</button>
          </div>

          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Admin User</td>
                <td>admin@modelwatch.com</td>
                <td><span className="role admin">admin</span></td>
                <td>2024-01-01</td>
                <td className="action-icons">✏️ 🗑️</td>
              </tr>

              <tr>
                <td>John Owner</td>
                <td>owner@modelwatch.com</td>
                <td><span className="role owner">model owner</span></td>
                <td>2024-01-05</td>
                <td className="action-icons">✏️ 🗑️</td>
              </tr>

              <tr>
                <td>Sarah Analyst</td>
                <td>analyst@modelwatch.com</td>
                <td><span className="role analyst">analyst</span></td>
                <td>2024-01-10</td>
                <td className="action-icons">✏️ 🗑️</td>
              </tr>

              <tr>
                <td>Mike Developer</td>
                <td>mike@modelwatch.com</td>
                <td><span className="role owner">model owner</span></td>
                <td>2024-01-15</td>
                <td className="action-icons">✏️ 🗑️</td>
              </tr>

              <tr>
                <td>Lisa Scientist</td>
                <td>lisa@modelwatch.com</td>
                <td><span className="role analyst">analyst</span></td>
                <td>2024-01-20</td>
                <td className="action-icons">✏️ 🗑️</td>
              </tr>
            </tbody>
          </table>

          <div className="table-footer">Showing 5 of 5 users</div>
        </div>
      </div>
    </div>
  );
}

export default Admin