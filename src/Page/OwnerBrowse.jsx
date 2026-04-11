import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredAccount } from "../session";
import { getModels } from "./modelStore";

function OwnerBrowse() {
  const navigate = useNavigate();
  const currentUser = getStoredAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVisibility, setSelectedVisibility] = useState("all");

  const [models] = useState(() => getModels());

  const accessibleModels = useMemo(() => {
    if (currentUser?.role === "owner") {
      return models.filter((model) => model.ownerEmail === currentUser.email);
    }

    return models.filter(
      (model) => model.visibility === "public" || model.visibility === "shared"
    );
  }, [currentUser, models]);

  const categories = useMemo(() => {
    return [...new Set(accessibleModels.map((model) => model.category))];
  }, [accessibleModels]);

  const filteredModels = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return accessibleModels.filter((model) => {
      const matchesSearch =
        !normalizedSearch ||
        model.name.toLowerCase().includes(normalizedSearch) ||
        model.description.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" || model.category === selectedCategory;

      const matchesVisibility =
        selectedVisibility === "all" || model.visibility === selectedVisibility;

      return matchesSearch && matchesCategory && matchesVisibility;
    });
  }, [accessibleModels, searchTerm, selectedCategory, selectedVisibility]);

  const handleViewModel = (modelId) => {
    navigate(`/owner/models/${modelId}`);
  };

  return (
    <div className="page-shell">
      <section className="page-title-section">
        <div>
          <h1>Model Browser</h1>
          <p>Explore and analyze models across the platform</p>
        </div>
      </section>

      <section className="search-card">
        <input
          type="text"
          placeholder="Search models by name or description..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <div className="filters-row">
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedVisibility}
            onChange={(event) => setSelectedVisibility(event.target.value)}
          >
            <option value="all">All Visibility</option>
            <option value="public">Public</option>
            <option value="shared">Shared</option>
            {currentUser?.role === "owner" ? <option value="private">Private</option> : null}
          </select>

          <button
            className="compare-button"
            type="button"
            onClick={() => navigate("/owner/compare")}
          >
            Compare Models
          </button>
        </div>
      </section>

      <section className="browse-list">
        {filteredModels.map((model) => (
          <article className="model-card" key={model.id}>
            <div className="model-card-top">
              <div>
                <h2>{model.name}</h2>
                <p>{model.description}</p>
              </div>

              <button
                className="primary-button"
                type="button"
                onClick={() => handleViewModel(model.id)}
              >
                View
              </button>
            </div>

            <div className="model-card-meta">
              <span className="tag-pill">{model.category}</span>
              <span>Owner: {model.ownerName}</span>
              <span>{model.notes?.length || 0} analytical notes</span>
              <span className="model-date">
                Updated {new Date(model.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </article>
        ))}

        {filteredModels.length === 0 ? (
          <article className="model-card">
            <p>No models found.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}

export default OwnerBrowse;