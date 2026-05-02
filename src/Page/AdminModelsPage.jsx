import React, { useEffect, useState } from "react";
import { api } from "../api";
import { TrashIcon } from "./AdminIcons";

function AdminModelsPage() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadModels() {
      try {
        setIsLoading(true);
        setError("");
        const data = await api.models.list();
        setModels(data);
      } catch (requestError) {
        setError(requestError.message || "Unable to load models.");
      } finally {
        setIsLoading(false);
      }
    }

    loadModels();
  }, []);

  const handleDelete = async (model) => {
    const confirmed = window.confirm(`Delete "${model.name}"?`);

    if (!confirmed) return;

    try {
      await api.models.remove(model.id);
      setModels((currentModels) =>
        currentModels.filter((item) => item.id !== model.id)
      );
    } catch (requestError) {
      alert(requestError.message || "Unable to delete model.");
    }
  };

  return (
    <div className="admin-section">
      <div className="dashboard-header">
        <h1>Model Management</h1>
        <p>Review and manage all models in the platform.</p>
      </div>

      <section className="table-card">
        <div className="section-toolbar">
          <h2>All Models</h2>
        </div>

        {isLoading ? <p>Loading models...</p> : null}
        {error ? <p className="inline-error">{error}</p> : null}

        {!isLoading && !error ? (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Visibility</th>
                  <th>Owner</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {models.map((model) => (
                  <tr key={model.id}>
                    <td>{model.name}</td>
                    <td>{model.category}</td>
                    <td>
                      <span className={`role ${model.visibility}`}>
                        {model.visibility}
                      </span>
                    </td>
                    <td>{model.ownerName}</td>
                    <td>
                      {model.updatedAt
                        ? new Date(model.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => handleDelete(model)}
                      >
                        <TrashIcon className="table-icon" />
                      </button>
                    </td>
                  </tr>
                ))}

                {models.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No models found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default AdminModelsPage;