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
  getStoredAccount,
  storeAccount,
} from "./session";
import { api, normalizeUser } from "./api";
import "./index.css";

function LoginPage() {
  const navigate = useNavigate();
  const storedAccount = getStoredAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!storedAccount) {
      return;
    }

    navigate(storedAccount.role === "admin" ? "/dashboard" : "/owner", { replace: true });
  }, [navigate, storedAccount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await api.login({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      const account = {
        ...normalizeUser(session.user),
        token: session.token,
        label: session.user.name,
      };

      storeAccount(account);
      navigate(account.role === "admin" ? "/dashboard" : "/owner", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Invalid login");
    } finally {
      setIsSubmitting(false);
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
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
          {error ? <div className="inline-error">{error}</div> : null}
        </form>

        <div className="demo-box">
          <h3>Demo Accounts</h3>
          <div className="demo-list">
            <div className="demo-item">
              <strong className="demo-label">Admin User:</strong>
              <span className="demo-value">admin@modelwatch.com / admin123</span>
            </div>
            <div className="demo-item">
              <strong className="demo-label">John Owner:</strong>
              <span className="demo-value">owner@modelwatch.com / owner123</span>
            </div>
            <div className="demo-item">
              <strong className="demo-label">Sarah Analyst:</strong>
              <span className="demo-value">analyst@modelwatch.com / analyst123</span>
            </div>
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
