import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { getStoredAccount } from "../session";
import {
  CompareIcon,
  EyeIcon,
  FilterIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "./OwnerIcons";

function getVisibilityIcon(visibility) {
  if (visibility === "private") {
    return <LockIcon className="owner-inline-icon" />;
  }

  if (visibility === "shared") {
    return <UsersIcon className="owner-inline-icon" />;
  }

  return <EyeIcon className="owner-inline-icon" />;
}

function getVisibilityClass(visibility) {
  if (visibility === "private") {
    return "visibility-badge private";
  }

  if (visibility === "shared") {
    return "visibility-badge shared";
  }

  return "visibility-badge public";
}

function OwnerDashboard() {
  const navigate = useNavigate();
  const currentUser = getStoredAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [myModels, setMyModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadModels() {
      setIsLoading(true);
      setError("");

      try {
        const models = await api.models.list({ ownerEmail: currentUser?.email });

        if (isMounted) {
          setMyModels(models);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || "Unable to load models.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadModels();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.email]);

  const filteredModels = useMemo(
    () =>
      myModels.filter((model) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          model.name.toLowerCase().includes(normalizedSearch) ||
          model.description.toLowerCase().includes(normalizedSearch);
        const matchesVisibility =
          filterVisibility === "all" || model.visibility === filterVisibility;

        return matchesSearch && matchesVisibility;
      }),
    [filterVisibility, myModels, searchTerm]
  );

  const totalUpdates = myModels.reduce((count, model) => count + model.updates.length, 0);

  const handleCreateModel = () => {
    navigate("/owner/models/new");
  };

  const handleViewModel = (modelId) => {
    navigate(`/owner/models/${modelId}`);
  };

  return (
    <div className="page-shell">
      <section className="page-title-section">
        <div>
          <h1>My Models</h1>
          <p>Manage and track your model portfolio.</p>
        </div>
      </section>

      <section className="metrics-row">
        <div className="metric-card owner-stat-card">
          <div>
            <p>Total Models</p>
            <h2>{myModels.length}</h2>
          </div>
          <div className="owner-stat-icon filter">
            <FilterIcon className="owner-panel-icon" />
          </div>
        </div>

        <div className="metric-card owner-stat-card">
          <div>
            <p>Public Models</p>
            <h2>{myModels.filter((model) => model.visibility === "public").length}</h2>
          </div>
          <div className="owner-stat-icon public">
            <EyeIcon className="owner-panel-icon" />
          </div>
        </div>

        <div className="metric-card owner-stat-card">
          <div>
            <p>Recent Updates</p>
            <h2>{totalUpdates}</h2>
          </div>
          <div className="owner-stat-icon updates">
            <PlusIcon className="owner-panel-icon" />
          </div>
        </div>
      </section>

      <section className="overview-card owner-models-panel">
        <div className="owner-toolbar">
          <div className="owner-toolbar-filters">
            <label className="owner-search-field">
              <SearchIcon className="owner-inline-icon owner-search-icon" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <select
              value={filterVisibility}
              onChange={(event) => setFilterVisibility(event.target.value)}
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          <div className="owner-toolbar-actions">
            <button type="button" className="primary-button" onClick={handleCreateModel}>
              <PlusIcon className="owner-inline-icon" />
              <span>Create Model</span>
            </button>

            <button
              type="button"
              className="secondary-action-button"
              onClick={() => navigate("/owner/compare")}
            >
              <CompareIcon className="owner-inline-icon" />
              <span>Compare</span>
            </button>
          </div>
        </div>

        <div className="owner-model-list">
          {isLoading ? (
            <div className="owner-empty-state">
              <p>Loading models...</p>
            </div>
          ) : null}

          {error ? (
            <div className="owner-empty-state">
              <p>{error}</p>
            </div>
          ) : null}

          {filteredModels.map((model) => (
            <article
              key={model.id}
              className="owner-model-card"
              onClick={() => handleViewModel(model.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleViewModel(model.id);
                }
              }}
            >
              <div className="owner-model-header">
                <div className="owner-model-copy">
                  <h3>{model.name}</h3>
                  <p>{model.description}</p>
                </div>

                <span className={getVisibilityClass(model.visibility)}>
                  {getVisibilityIcon(model.visibility)}
                  <span>{model.visibility}</span>
                </span>
              </div>

              <div className="owner-model-footer">
                <div className="owner-model-meta">
                  <span className="tag-pill">{model.category}</span>
                  <span>{model.attributes.length} attributes</span>
                  <span>{model.updates.length} updates</span>
                </div>

                <span className="model-date">
                  Updated {new Date(model.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}

          {!isLoading && !error && filteredModels.length === 0 ? (
            <div className="owner-empty-state">
              <p>No models found. Create your first model to get started.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default OwnerDashboard;
