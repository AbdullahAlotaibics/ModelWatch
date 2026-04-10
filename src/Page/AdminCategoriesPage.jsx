import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CloseIcon, EditIcon, FolderTreeIcon, PlusIcon, TrashIcon } from "./AdminIcons";

const emptyForm = {
  name: "",
  description: "",
};

function validateCategoryForm(formData) {
  const nextErrors = {};

  if (!formData.name.trim()) {
    nextErrors.name = "Category name is required.";
  }

  if (!formData.description.trim()) {
    nextErrors.description = "Description is required.";
  }

  return nextErrors;
}

function AdminCategoriesPage() {
  const { categories, createCategory, updateCategory, deleteCategory } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  function closeModal() {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(emptyForm);
    setErrors({});
  }

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

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(categoryId);
    }
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

    const validationErrors = validateCategoryForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const normalizedCategory = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        ...normalizedCategory,
      });
    } else {
      createCategory(normalizedCategory);
    }

    closeModal();
  };

  return (
    <div className="admin-section">
      <div className="dashboard-header">
        <h1>Category Management</h1>
        <p>Organize models into categories for better classification.</p>
      </div>

      <section className="table-card">
        <div className="section-toolbar">
          <h2>All Categories</h2>
          <button type="button" className="add-btn" onClick={handleAddCategory}>
            <PlusIcon className="toolbar-icon" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <article key={category.id} className="category-card">
              <div className="category-card-main">
                <div className="category-icon-shell">
                  <FolderTreeIcon className="toolbar-icon" />
                </div>

                <div className="category-copy">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </div>

              <div className="action-icons">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Edit ${category.name}`}
                  onClick={() => handleEditCategory(category)}
                >
                  <EditIcon className="table-icon" />
                </button>
                <button
                  type="button"
                  className="icon-btn danger"
                  aria-label={`Delete ${category.name}`}
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <TrashIcon className="table-icon" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeModal}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 id="category-modal-title">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <p>
                  {editingCategory
                    ? "Update the category name and description."
                    : "Create a new category for model organization."}
                </p>
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
                <span>Category Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                />
                {errors.name ? <small>{errors.name}</small> : null}
              </label>

              <label className="modal-field">
                <span>Description</span>
                <textarea
                  className="modal-textarea"
                  rows="3"
                  value={formData.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                />
                {errors.description ? <small>{errors.description}</small> : null}
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminCategoriesPage;
