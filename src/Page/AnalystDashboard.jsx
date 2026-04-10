import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ownerCategories, ownerModels } from "./ownerModels";
import {
  CompareIcon,
  EyeIcon,
  FilterIcon,
  LockIcon,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
} from "./OwnerIcons";

function getVisibilityIcon(visibility) {
  if (visibility === "shared") {
    return <UsersIcon className="owner-inline-icon" />;
  }

  if (visibility === "private") {
    return <LockIcon className="owner-inline-icon" />;
  }

  return <EyeIcon className="owner-inline-icon" />;
}

function getVisibilityClass(visibility) {
  if (visibility === "shared") {
    return "visibility-badge shared";
  }

  if (visibility === "private") {
    return "visibility-badge private";
  }

  return "visibility-badge public";
}

function AnalystDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");

  const accessibleModels = useMemo(
    () =>
      ownerModels.filter(
        (model) => model.visibility === "public" || model.visibility === "shared"
      ),
    []
  );

  const filteredModels = useMemo(
    () =>
      accessibleModels.filter((model) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          model.name.toLowerCase().includes(normalizedSearch) ||
          model.description.toLowerCase().includes(normalizedSearch);
        const matchesCategory =
          filterCategory === "all" || model.category === filterCategory;
        const matchesVisibility =
          filterVisibility === "all" || model.visibility === filterVisibility;

        return matchesSearch && matchesCategory && matchesVisibility;
      }),
    [accessibleModels, filterCategory, filterVisibility, searchTerm]
  );

  const analyzedCount = accessibleModels.filter((model) => model.notes.length > 0).length;
  const handlePendingRoute = () => {};

  return (
    <div className="page-shell">
      <section className="page-title-section">
        <div>
          <h1>Model Browser</h1>
          <p>Explore and analyze models across the platform.</p>
        </div>
      </section>

      <section className="metrics-row">
        <div className="metric-card owner-stat-card">
          <div>
            <p>Accessible Models</p>
            <h2>{accessibleModels.length}</h2>
          </div>
          <div className="owner-stat-icon filter">
            <FilterIcon className="owner-panel-icon" />
          </div>
        </div>

        <div className="metric-card owner-stat-card">
          <div>
            <p>Categories</p>
            <h2>{ownerCategories.length}</h2>
          </div>
          <div className="owner-stat-icon trend">
            <TrendingUpIcon className="owner-panel-icon" />
          </div>
        </div>

        <div className="metric-card owner-stat-card">
          <div>
            <p>Analyzed</p>
            <h2>{analyzedCount}</h2>
          </div>
          <div className="owner-stat-icon public">
            <EyeIcon className="owner-panel-icon" />
          </div>
        </div>
      </section>

      <section className="overview-card owner-models-panel">
        <div className="owner-toolbar owner-analyst-toolbar">
          <label className="owner-search-field owner-search-wide">
            <SearchIcon className="owner-inline-icon owner-search-icon" />
            <input
              type="text"
              placeholder="Search models by name or description..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <div className="owner-toolbar-filters">
            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
            >
              <option value="all">All Categories</option>
              {ownerCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filterVisibility}
              onChange={(event) => setFilterVisibility(event.target.value)}
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="shared">Shared</option>
            </select>

            <button
              type="button"
              className="secondary-action-button"
              onClick={() => navigate("/owner/compare")}
            >
              <CompareIcon className="owner-inline-icon" />
              <span>Compare Models</span>
            </button>
          </div>
        </div>

        <div className="owner-model-list">
          {filteredModels.map((model) => (
            <article
              key={model.id}
              className="owner-model-card"
              onClick={handlePendingRoute}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handlePendingRoute();
                }
              }}
            >
              <div className="owner-model-header">
                <div className="owner-model-copy">
                  <div className="owner-model-title-row">
                    <h3>{model.name}</h3>
                    <span className={getVisibilityClass(model.visibility)}>
                      {getVisibilityIcon(model.visibility)}
                      <span>{model.visibility}</span>
                    </span>
                  </div>
                  <p>{model.description}</p>
                </div>
              </div>

              <div className="owner-model-footer">
                <div className="owner-model-meta">
                  <span className="tag-pill">{model.category}</span>
                  <span>Owner: {model.ownerName}</span>
                  <span>{model.notes.length} analytical notes</span>
                </div>

                <span className="model-date">
                  Updated {new Date(model.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}

          {filteredModels.length === 0 ? (
            <div className="owner-empty-state">
              <p>No models found matching your criteria.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default AnalystDashboard;
