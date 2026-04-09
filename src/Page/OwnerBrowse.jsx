import React from "react";

const models = [
  {
    title: "Customer Churn Predictor",
    description: "Random Forest model for predicting customer churn with 89% accuracy",
    label: "Machine Learning",
    owner: "John Owner",
    updates: "1 analytical notes",
    updated: "2/20/2024",
  },
  {
    title: "Sentiment Analysis BERT",
    description: "Fine-tuned BERT model for customer sentiment classification",
    label: "NLP",
    owner: "Sarah Analyst",
    updates: "2 analytical notes",
    updated: "2/18/2024",
  },
];

function OwnerBrowse() {
  return (
    <div className="page-shell">
      <section className="page-title-section">
        <div>
          <h1>Model Browser</h1>
          <p>Explore and analyze models across the platform</p>
        </div>
      </section>

      <section className="search-card">
        <input type="text" placeholder="Search models by name or description..." />
        <div className="filters-row">
          <select>
            <option>All Categories</option>
            <option>Machine Learning</option>
            <option>NLP</option>
          </select>
          <select>
            <option>All Visibility</option>
            <option>Public</option>
            <option>Private</option>
          </select>
          <button className="compare-button">Compare Models</button>
        </div>
      </section>

      <section className="browse-list">
        {models.map((model) => (
          <article className="model-card" key={model.title}>
            <div className="model-card-top">
              <div>
                <h2>{model.title}</h2>
                <p>{model.description}</p>
              </div>
              <button className="primary-button">View</button>
            </div>

            <div className="model-card-meta">
              <span className="tag-pill">{model.label}</span>
              <span>Owner: {model.owner}</span>
              <span>{model.updates}</span>
              <span className="model-date">Updated {model.updated}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default OwnerBrowse;
