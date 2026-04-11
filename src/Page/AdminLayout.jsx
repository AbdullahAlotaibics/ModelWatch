import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAllIssues, updateIssue as updateStoredIssue} from "./issueStore";
import { clearStoredAccount, getStoredAccount } from "../session";
import {
  AlertCircleIcon,
  ChartIcon,
  DashboardIcon,
  FolderTreeIcon,
  LogOutIcon,
  UsersIcon,
} from "./AdminIcons";
import "./admin.css";

const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@modelwatch.com",
    role: "admin",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "John Owner",
    email: "owner@modelwatch.com",
    role: "owner",
    createdAt: "2024-01-05",
  },
  {
    id: 3,
    name: "Sarah Analyst",
    email: "analyst@modelwatch.com",
    role: "analyst",
    createdAt: "2024-01-10",
  },
  {
    id: 4,
    name: "Mike Developer",
    email: "mike@modelwatch.com",
    role: "owner",
    createdAt: "2024-01-15",
  },
  {
    id: 5,
    name: "Lisa Scientist",
    email: "lisa@modelwatch.com",
    role: "analyst",
    createdAt: "2024-01-20",
  },
];

const initialCategories = [
  {
    id: "1",
    name: "Natural Language Processing",
    description: "Models focused on text understanding, generation, and language analysis.",
  },
  {
    id: "2",
    name: "Computer Vision",
    description: "Image recognition, object detection, and visual classification models.",
  },
  {
    id: "3",
    name: "Forecasting",
    description: "Predictive models used for demand, risk, and trend forecasting workflows.",
  },
];

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
  const [users, setUsers] = useState(initialUsers);
  const [categories, setCategories] = useState(initialCategories);
  const [issues, setIssues] = useState(getAllIssues());

  const outletContext = useMemo(
    () => ({
      currentUser,
      users,
      categories,
      issues,
      createUser(user) {
        setUsers((currentUsers) => [
          {
            ...user,
            id: Date.now(),
            createdAt: new Date().toISOString().slice(0, 10),
          },
          ...currentUsers,
        ]);
      },
      updateUser(updatedUser) {
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        );
      },
      deleteUser(userId) {
        setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
      },
      createCategory(category) {
        setCategories((currentCategories) => [
          ...currentCategories,
          {
            id: String(Date.now()),
            ...category,
          },
        ]);
      },
      updateCategory(updatedCategory) {
        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === updatedCategory.id ? { ...category, ...updatedCategory } : category
          )
        );
      },
      deleteCategory(categoryId) {
        setCategories((currentCategories) =>
          currentCategories.filter((category) => category.id !== categoryId)
        );
      },

      createIssue(issue) {
        setIssues((currentIssues) => [
          {
            ...issue,
            id: String(Date.now()),
            createdAt: new Date().toISOString().slice(0, 10),
            status: "open",
            resolutionNote: "",
          },
          ...currentIssues,
        ]);
      },

      updateIssue(issueId, updates) {
        const updatedIssues = updateStoredIssue(issueId, updates);
        setIssues(updatedIssues);
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
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}

export default AdminLayout;
