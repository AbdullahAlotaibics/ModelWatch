import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ModelFormPage from "./Page/ModelFormPage";
import AdminCategoriesPage from "./Page/AdminCategoriesPage";
import AdminDashboardPage from "./Page/AdminDashboardPage";
import AdminIssuesPage from "./Page/AdminIssuesPage";
import AdminLayout from "./Page/AdminLayout";
import AdminUsersPage from "./Page/AdminUsersPage";
import OwnerHome from "./Page/OwnerHome";
import OwnerLayout from "./Page/OwnerLayout";
import OwnerBrowse from "./Page/OwnerBrowse";
import OwnerCompare from "./Page/OwnerCompare";
import ModelDetailsPage from "./Page/ModelDetailsPage";
import {
  clearStoredAccount,
  demoAccounts,
  getStoredAccount,
  storeAccount,
} from "./session";
import "./index.css";

function LoginPage() {
  const navigate = useNavigate();
  const storedAccount = getStoredAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!storedAccount) {
      return;
    }

    navigate(storedAccount.role === "admin" ? "/dashboard" : "/owner", { replace: true });
  }, [navigate, storedAccount]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const matchedAccount = demoAccounts.find(
      (account) =>
        account.email === email.trim().toLowerCase() &&
        account.password === password.trim()
    );

    if (!matchedAccount) {
      alert("Invalid login");
      return;
    }

    storeAccount(matchedAccount);
    navigate(matchedAccount.role === "admin" ? "/dashboard" : "/owner", { replace: true });
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
              onChange={(event) => setEmail(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
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
                <span>
                  {account.email} / {account.password}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const account = getStoredAccount();

  if (!account || !allowedRoles.includes(account.role)) {
    clearStoredAccount();
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/issues" element={<AdminIssuesPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["owner", "analyst"]} />}>
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerHome />} />
            <Route path="browse" element={<OwnerBrowse />} />
            <Route path="compare" element={<OwnerCompare />} />
            <Route path="models/new" element={<ModelFormPage />} />
            <Route path="models/:modelId" element={<ModelDetailsPage />} />
            <Route path="models/:modelId/edit" element={<ModelFormPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;