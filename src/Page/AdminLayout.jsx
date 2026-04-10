import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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

const initialIssues = [
  {
    id: "1",
    title: "Bias detected in credit risk model",
    description: "A reviewer flagged uneven approval rates across protected groups in the latest evaluation run.",
    reportedBy: "Sarah Analyst",
    createdAt: "2026-04-02",
    status: "open",
    modelName: "Credit Risk Classifier",
    reason: "Fairness concern",
    resolutionNote: "",
  },
  {
    id: "2",
    title: "Missing model card details",
    description: "The deployment record was published without the required documentation for intended use and limitations.",
    reportedBy: "John Owner",
    createdAt: "2026-04-05",
    status: "in-review",
    modelName: "Sentiment Analysis BERT",
    reason: "Documentation gap",
    resolutionNote: "",
  },
  {
    id: "3",
    title: "Resolved drift alert investigation",
    description: "A production model drift alert was reviewed and the threshold configuration was updated.",
    reportedBy: "Admin User",
    createdAt: "2026-04-07",
    status: "resolved",
    modelName: "Demand Forecasting v2",
    reason: "Monitoring alert",
    resolutionNote: "Adjusted the alert threshold and documented the updated monitoring baseline.",
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
  const [issues, setIssues] = useState(initialIssues);

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
      updateIssue(issueId, updates) {
        setIssues((currentIssues) =>
          currentIssues.map((issue) =>
            issue.id === issueId ? { ...issue, ...updates } : issue
          )
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
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}

export default AdminLayout;
