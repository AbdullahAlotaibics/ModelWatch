import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./owner.css";

function OwnerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const account = location.state || {};
  const userName = account.label || "Model Owner";
  const userRole = account.role === "owner" ? "Model Owner" : account.role || "Owner";

  return (
    <div className="owner-page">
      <header className="owner-header">
        <div className="owner-brand">
          <div className="brand-icon">📊</div>
          <span>Model Watch</span>
        </div>

        <nav className="owner-nav">
          <NavLink to="/owner" className={({ isActive }) => isActive ? "active" : ""} end>
            Dashboard
          </NavLink>
          <NavLink to="/owner/browse" className={({ isActive }) => isActive ? "active" : ""}>
            Browse Models
          </NavLink>
          <NavLink to="/owner/compare" className={({ isActive }) => isActive ? "active" : ""}>
            Compare
          </NavLink>
        </nav>

        <div className="owner-actions">
          <div className="owner-user">
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>
          <button className="logout-button" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>
      </header>

      <main className="owner-main">
        <Outlet />
      </main>
    </div>
  );
}

export default OwnerLayout;
