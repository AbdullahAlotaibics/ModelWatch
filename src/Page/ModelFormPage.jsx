import React, {  useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoredAccount } from "../session";
import { ownerCategories } from "./ownerModels";
import { createModel, getModelById, updateModel } from "./modelStore";
import { ArrowLeftIcon, PlusIcon } from "./OwnerIcons";

const visibilityOptions = [
  { value: "private", label: "Private" },
  { value: "shared", label: "Shared" },
  { value: "public", label: "Public" },
];

function ModelFormPage() {
  const navigate = useNavigate();
  const currentUser = getStoredAccount();
  const { modelId } = useParams();
  const isEditMode = Boolean(modelId);

  const categoryOptions = useMemo(
    () => ownerCategories.map((category) => category.name),
    []
  );

  const existingModel = useMemo(
    () => (isEditMode ? getModelById(modelId) : null),
    [isEditMode, modelId]
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: categoryOptions[0] || "",
    visibility: "private",
  });

  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if(!isEditMode || !existingModel) {
      return;
    }
    
    setForm({
      name: existingModel.name || "",
      description: existingModel.description || "",
      category: existingModel.category || categoryOptions[0] || "",
      visibility: existingModel.visibility || "private",
    });
    setAttributes(existingModel.attributes || []);
  }, [categoryOptions, existingModel, isEditMode]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddAttribute = () => {
    const trimmedName = attributeName.trim();
    const trimmedValue = attributeValue.trim();

    if (!trimmedName || !trimmedValue) {
      setError("Please enter both attribute name and value.");
      return;
    }

    setAttributes((prev) => [
      ...prev,
      { name: trimmedName, value: trimmedValue },
    ]);

    setAttributeName("");
    setAttributeValue("");
    setError("");
  };

  const handleRemoveAttribute = (indexToRemove) => {
    setAttributes((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const now = new Date().toISOString();

    if (isEditMode && existingModel){
      const updatedModel = {
        ...existingModel,
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        visibility: form.visibility,
        updatedAt: now,
        attributes,
        updates: [...(existingModel.updates|| []), "Model details updated"],
      };

      updateModel(updatedModel);
      navigate(`/owner/models/${existingModel.id}`, {replace: true});
      return;
    }

    const newModel = {
      id: `model-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      visibility: form.visibility,
      ownerName: currentUser?.label || "Model Owner",
      ownerEmail: currentUser?.email || "",
      createdAt: now,
      updatedAt: now,
      updates: ["Model created"],
      notes: [],
      attributes,
    };

    createModel(newModel);
    navigate("/owner", { replace: true });
  };

  if (isEditMode && !existingModel) {
  return (
    <div className="page-shell">
      <div className="overview-card">
        <h2>Model not found</h2>
        <p>The model you are trying to edit does not exist.</p>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/owner/browse")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="page-shell">
      <button
        type="button"
        className="owner-back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="owner-inline-icon" />
        <span>Back</span>
      </button>

      <section className="overview-card model-form-card">
        <div className="page-title-section">
          <h1>{isEditMode ? "Edit Model" : "Create New Model"}</h1>
          <p>
            {isEditMode ? "Update your model profile and attributes." : "Add a new model profile to your portfolio."}</p>
        </div>

        <form className="model-form" onSubmit={handleSubmit}>
          <div className="form-block">
            <label htmlFor="model-name">Model Name *</label>
            <input
              id="model-name"
              type="text"
              placeholder="e.g., Customer Sentiment Analyzer"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
          </div>

          <div className="form-block">
            <label htmlFor="model-description">Description *</label>
            <textarea
              id="model-description"
              rows="5"
              placeholder="Describe your model's purpose, methodology, and key features..."
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
            />
          </div>

          <div className="form-grid-two">
            <div className="form-block">
              <label htmlFor="model-category">Category *</label>
              <select
                id="model-category"
                value={form.category}
                onChange={(event) => handleChange("category", event.target.value)}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-block">
              <label htmlFor="model-visibility">Visibility *</label>
              <select
                id="model-visibility"
                value={form.visibility}
                onChange={(event) =>
                  handleChange("visibility", event.target.value)
                }
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-block">
            <h2 className="form-section-title">Model Attributes</h2>

            <div className="attribute-entry-row">
              <input
                type="text"
                placeholder="Attribute name"
                value={attributeName}
                onChange={(event) => setAttributeName(event.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={attributeValue}
                onChange={(event) => setAttributeValue(event.target.value)}
              />
              <button
                type="button"
                className="secondary-action-button"
                onClick={handleAddAttribute}
              >
                <PlusIcon className="owner-inline-icon" />
                <span>Add Attribute</span>
              </button>
            </div>

            {attributes.length > 0 ? (
              <div className="attribute-list">
                {attributes.map((attribute, index) => (
                  <div
                    className="attribute-chip-row"
                    key={`${attribute.name}-${index}`}
                  >
                    <span>
                      <strong>{attribute.name}:</strong> {attribute.value}
                    </span>
                    <button
                      type="button"
                      className="text-action-button"
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(isEditMode ? `/owner/models/${modelId}` : "/owner")}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {isEditMode ? "Save Changes" : "Create Model"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ModelFormPage;