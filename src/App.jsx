import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Admin from "./page/Admin";
import OwnerLayout from "./Page/OwnerLayout";
import OwnerDashboard from "./Page/OwnerDashboard";
import OwnerBrowse from "./Page/OwnerBrowse";
import OwnerCompare from "./Page/OwnerCompare";
import "./index.css";

const demoAccounts = [
  { label: "Admin", role: "admin", email: "admin@modelwatch.com", password: "admin123" },
  { label: "John Owner", role: "owner", email: "owner@modelwatch.com", password: "owner123" },
  { label: "Sarah Analyst", role: "analyst", email: "analyst@modelwatch.com", password: "analyst123" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const matchedAccount = demoAccounts.find(
      (account) =>
        account.email === email.trim().toLowerCase() &&
        account.password === password.trim()
    );

    if (matchedAccount) {
      const route = matchedAccount.role === "admin" ? "/admin" : "/owner";
      navigate(route, { state: matchedAccount });
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-header">
          <h1 className="title">Model Watch</h1>
          <p className="subtitle">Centralized Model Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="input-label" htmlFor="email">
              Email Address
            </label>
            <input
              className="login-input"
              id="email"
              type="email"
              placeholder="user@modelwatch.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              className="login-input"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Sign In
          </button>
        </form>

        <div className="demo-box">
          <h3>Demo Accounts</h3>
          <div className="demo-list">
            {demoAccounts.map((account) => (
              <div key={account.email} className="demo-item">
                <strong>{account.label}:</strong>
                <span>{account.email} / {account.password}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard />} />
          <Route path="browse" element={<OwnerBrowse />} />
          <Route path="compare" element={<OwnerCompare />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;