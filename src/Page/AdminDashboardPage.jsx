import React from "react";
import { useOutletContext } from "react-router-dom";

function AdminDashboardPage() {
  const { users } = useOutletContext();
  const adminCount = users.filter((user) => user.role === "admin").length;
  const ownerCount = users.filter((user) => user.role === "owner").length;
  const analystCount = users.filter((user) => user.role === "analyst").length;

  return (
    <div className="admin-section">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor platform users and jump into management workflows from a single place.</p>
      </div>

      <section className="admin-summary-grid">
        <article className="admin-summary-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </article>
        <article className="admin-summary-card">
          <span>Administrators</span>
          <strong>{adminCount}</strong>
        </article>
        <article className="admin-summary-card">
          <span>Model Owners</span>
          <strong>{ownerCount}</strong>
        </article>
        <article className="admin-summary-card">
          <span>Analysts</span>
          <strong>{analystCount}</strong>
        </article>
      </section>

      <section className="admin-placeholder-card">
        <h2>Management Overview</h2>
        <p>
          User management is fully interactive. Categories and issues navigation are wired and ready
          for the next implementation pass.
        </p>
      </section>
    </div>
  );
}

export default AdminDashboardPage;
