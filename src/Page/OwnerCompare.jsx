import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredAccount } from "../session";
import { ArrowLeftIcon, CompareIcon } from "./OwnerIcons";
import { ownerModels } from "./ownerModels";

function getAttributeValue(model, attributeName) {
  const attribute = model.attributes.find((item) => item.name === attributeName);
  return attribute ? attribute.value : "-";
}

function OwnerCompare() {
  const navigate = useNavigate();
  const currentUser = getStoredAccount();
  const [selectedModels, setSelectedModels] = useState([]);
  const [compareAttributes, setCompareAttributes] = useState([]);

  const accessibleModels = useMemo(() => {
    if (currentUser?.role === "owner") {
      return ownerModels.filter((model) => model.ownerEmail === currentUser.email);
    }

    return ownerModels.filter(
      (model) => model.visibility === "public" || model.visibility === "shared"
    );
  }, [currentUser]);

  const selectedModelObjects = useMemo(
    () => accessibleModels.filter((model) => selectedModels.includes(model.id)),
    [accessibleModels, selectedModels]
  );

  const allAttributes = useMemo(
    () =>
      Array.from(
        new Set(
          selectedModelObjects.flatMap((model) =>
            model.attributes.map((attribute) => attribute.name)
          )
        )
      ),
    [selectedModelObjects]
  );

  const visibleAttributes = compareAttributes.length > 0 ? compareAttributes : allAttributes;

  const handleModelToggle = (modelId) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels((currentModels) => currentModels.filter((id) => id !== modelId));
      return;
    }

    if (selectedModels.length >= 4) {
      alert("You can compare up to 4 models at a time");
      return;
    }

    setSelectedModels((currentModels) => [...currentModels, modelId]);
  };

  const handleAttributeToggle = (attributeName) => {
    if (compareAttributes.includes(attributeName)) {
      setCompareAttributes((currentAttributes) =>
        currentAttributes.filter((item) => item !== attributeName)
      );
      return;
    }

    setCompareAttributes((currentAttributes) => [...currentAttributes, attributeName]);
  };

  return (
    <div className="page-shell">
      <button type="button" className="owner-back-button" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="owner-inline-icon" />
        <span>Back</span>
      </button>

      <section className="page-title-section owner-title-with-icon">
        <div>
          <h1>
            <CompareIcon className="owner-hero-icon" />
            <span>Model Comparison</span>
          </h1>
          <p>Select models to compare their attributes side by side.</p>
        </div>
      </section>

      <section className="owner-compare-layout">
        <aside className="owner-compare-sidebar">
          <div className="overview-card owner-compare-card">
            <h2>Select Models ({selectedModels.length}/4)</h2>

            <div className="owner-model-select-list">
              {accessibleModels.map((model) => (
                <label
                  key={model.id}
                  className={`owner-model-option${
                    selectedModels.includes(model.id) ? " selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.id)}
                    onChange={() => handleModelToggle(model.id)}
                  />
                  <div>
                    <p>{model.name}</p>
                    <span>{model.category}</span>
                  </div>
                </label>
              ))}
            </div>

            {selectedModels.length >= 2 && allAttributes.length > 0 ? (
              <div className="owner-attribute-filter">
                <h3>Compare Attributes</h3>

                <div className="owner-attribute-list">
                  {allAttributes.map((attributeName) => (
                    <label key={attributeName} className="owner-attribute-option">
                      <input
                        type="checkbox"
                        checked={compareAttributes.includes(attributeName)}
                        onChange={() => handleAttributeToggle(attributeName)}
                      />
                      <span>{attributeName}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="owner-compare-results">
          {selectedModels.length < 2 ? (
            <div className="overview-card owner-compare-empty">
              <CompareIcon className="owner-empty-icon" />
              <h3>Select at least 2 models to compare</h3>
              <p>Choose models from the list to see a side-by-side comparison.</p>
            </div>
          ) : (
            <div className="overview-card owner-compare-table-card">
              <div className="owner-compare-table-wrap">
                <table className="owner-compare-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      {selectedModelObjects.map((model) => (
                        <th key={model.id}>{model.name}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Category</td>
                      {selectedModelObjects.map((model) => (
                        <td key={model.id}>
                          <span className="tag-pill">{model.category}</span>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td>Owner</td>
                      {selectedModelObjects.map((model) => (
                        <td key={model.id}>{model.ownerName}</td>
                      ))}
                    </tr>

                    <tr>
                      <td>Visibility</td>
                      {selectedModelObjects.map((model) => (
                        <td key={model.id} className="compare-capitalize">
                          {model.visibility}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td>Created</td>
                      {selectedModelObjects.map((model) => (
                        <td key={model.id}>
                          {new Date(model.createdAt).toLocaleDateString()}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td>Updates</td>
                      {selectedModelObjects.map((model) => (
                        <td key={model.id}>{model.updates.length}</td>
                      ))}
                    </tr>

                    <tr className="owner-compare-section-row">
                      <td colSpan={selectedModelObjects.length + 1}>Model Attributes</td>
                    </tr>

                    {visibleAttributes.map((attributeName) => (
                      <tr key={attributeName}>
                        <td>{attributeName}</td>
                        {selectedModelObjects.map((model) => (
                          <td key={model.id}>{getAttributeValue(model, attributeName)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default OwnerCompare;
