import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearStoredAccount, getStoredAccount } from "../session";
import { api } from "../api";
import {
  AlertCircleIcon,
  ChartIcon,
  DashboardIcon,
  FolderTreeIcon,
  LogOutIcon,
  UsersIcon,
} from "./AdminIcons";
import "./admin.css";

function formatRoleLabel(role) {
  if (role === "owner") {
    return "Model Owner";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Analyst";
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getStoredAccount();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        setIsLoading(true);
        setError("");
        const [nextUsers, nextCategories, nextIssues] = await Promise.all([
          api.users.list(),
          api.categories.list(),
          api.issues.list(),
        ]);

        if (!isMounted) {
          return;
        }

        setUsers(nextUsers);
        setCategories(nextCategories);
        setIssues(nextIssues);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Unable to load admin data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, []);

  const outletContext = useMemo(
    () => ({
      currentUser,
      users,
      categories,
      issues,
      async createUser(user) {
        const createdUser = await api.users.create(user);
        setUsers((currentUsers) => [createdUser, ...currentUsers]);
      },
      async updateUser(updatedUser) {
        await api.users.update(updatedUser.id, updatedUser);
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        );
      },
      async deleteUser(userId) {
        await api.users.remove(userId);
        setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
      },
      async createCategory(category) {
        const createdCategory = await api.categories.create(category);
        setCategories((currentCategories) => [...currentCategories, createdCategory]);
      },
      async updateCategory(updatedCategory) {
        const savedCategory = await api.categories.update(updatedCategory.id, updatedCategory);
        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === updatedCategory.id ? savedCategory : category
          )
        );
      },
      async deleteCategory(categoryId) {
        await api.categories.remove(categoryId);
        setCategories((currentCategories) =>
          currentCategories.filter((category) => category.id !== categoryId)
        );
      },

      async createIssue(issue) {
        const createdIssue = await api.issues.create(issue);
        setIssues((currentIssues) => [createdIssue, ...currentIssues]);
      },

      async updateIssue(issueId, updates) {
        const updatedIssue = await api.issues.update(issueId, updates);
        setIssues((currentIssues) =>
          currentIssues.map((issue) => (issue.id === issueId ? updatedIssue : issue))
        );
      },
    }),
    [categories, currentUser, issues, users]
  );

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: DashboardIcon, end: true },
    { to: "/admin/users", label: "Users", icon: UsersIcon },
    { to: "/admin/categories", label: "Categories", icon: FolderTreeIcon },
    { to: "/admin/issues", label: "Issues", icon: AlertCircleIcon },
  ];

  const handleLogout = () => {
    clearStoredAccount();
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-page">
      <nav className="navbar">
        <div className="navbar-left">
          <button
            type="button"
            className="logo brand-button"
            onClick={() => navigate("/dashboard")}
          >
            <span className="logo-icon-shell">
              <ChartIcon className="nav-icon" />
            </span>
            <span>Model Watch</span>
          </button>

          <div className="nav-links" aria-label="Admin navigation">
            {navItems.map(({ to, label, icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav-link${isActive || (label === "Users" && location.pathname === "/admin") ? " active" : ""}`
                }
              >
                {React.createElement(icon, { className: "nav-icon" })}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <div className="user-name">{currentUser?.label || "Admin User"}</div>
            <div className="user-role">{formatRoleLabel(currentUser?.role)}</div>
          </div>
          <button className="logout-btn" type="button" onClick={handleLogout}>
            <LogOutIcon className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="content">
        {error ? <div className="inline-error">{error}</div> : null}
        {isLoading ? (
          <div className="admin-section">
            <div className="admin-placeholder-card">
              <h2>Loading admin data...</h2>
            </div>
          </div>
        ) : (
          <Outlet context={outletContext} />
        )}
      </main>
    </div>
  );
}

export default AdminLayout;
