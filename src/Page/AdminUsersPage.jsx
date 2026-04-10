import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CloseIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "./AdminIcons";

const emptyForm = {
  name: "",
  email: "",
  role: "analyst",
};

const roleOptions = [
  { value: "analyst", label: "Analyst" },
  { value: "owner", label: "Model Owner" },
  { value: "admin", label: "Admin" },
];

function formatRole(role) {
  if (role === "owner") {
    return "model owner";
  }

  return role;
}

function validateUserForm(formData) {
  const nextErrors = {};

  if (!formData.name.trim()) {
    nextErrors.name = "Name is required.";
  }

  if (!formData.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  return nextErrors;
}

function AdminUsersPage() {
  const { users, createUser, updateUser, deleteUser } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  function closeModal() {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData(emptyForm);
    setErrors({});
  }

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      const haystack = `${user.name} ${user.email}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [searchTerm, users]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (!isModalOpen) {
      return undefined;
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateUserForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const normalizedUser = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
    };

    if (editingUser) {
      updateUser({
        ...editingUser,
        ...normalizedUser,
      });
    } else {
      createUser(normalizedUser);
    }

    closeModal();
  };

  const handleDelete = (user) => {
    if (user.role === "admin") {
      return;
    }

    const shouldDelete = window.confirm("Are you sure you want to delete this user?");

    if (shouldDelete) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="admin-section">
      <div className="dashboard-header">
        <h1>User Management</h1>
        <p>Manage user accounts, roles, and permissions.</p>
      </div>

      <section className="table-card">
        <div className="toolbar">
          <label className="search-field">
            <SearchIcon className="toolbar-icon" />
            <input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <button className="add-btn" type="button" onClick={openCreateModal}>
            <PlusIcon className="toolbar-icon" />
            <span>Add User</span>
          </button>
        </div>

        <div className="table-wrapper">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role ${user.role}`}>{formatRole(user.role)}</span>
                    </td>
                    <td>{user.createdAt}</td>
                    <td>
                      <div className="action-icons">
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Edit ${user.name}`}
                          onClick={() => openEditModal(user)}
                        >
                          <EditIcon className="table-icon" />
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          aria-label={`Delete ${user.name}`}
                          onClick={() => handleDelete(user)}
                          disabled={user.role === "admin"}
                        >
                          <TrashIcon className="table-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 id="user-modal-title">{editingUser ? "Edit User" : "Add User"}</h2>
                <p>{editingUser ? "Update user details and role." : "Create a new user account."}</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close modal"
                onClick={closeModal}
              >
                <CloseIcon className="table-icon" />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <label className="modal-field">
                <span>Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                />
                {errors.name ? <small>{errors.name}</small> : null}
              </label>

              <label className="modal-field">
                <span>Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                />
                {errors.email ? <small>{errors.email}</small> : null}
              </label>

              <label className="modal-field">
                <span>Role</span>
                <select
                  value={formData.role}
                  onChange={(event) => handleChange("role", event.target.value)}
                >
                  {roleOptions.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminUsersPage;
