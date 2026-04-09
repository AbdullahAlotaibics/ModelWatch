import React from "react";

function OwnerDashboard() {
  return (
    <div className="page-shell">
      <section className="page-title-section">
        <div>
          <h1>Welcome back, Owner</h1>
          <p>Track your models, monitor performance, and review updates in one place.</p>
        </div>
      </section>

      <section className="metrics-row">
        <div className="metric-card">
          <p>Accessible Models</p>
          <h2>3</h2>
        </div>
        <div className="metric-card">
          <p>Categories</p>
          <h2>5</h2>
        </div>
        <div className="metric-card">
          <p>Analyzed</p>
          <h2>2</h2>
        </div>
      </section>

      <section className="overview-card">
        <div className="overview-header">
          <div>
            <h2>Sentiment Analysis BERT</h2>
            <p>Fine-tuned BERT model for customer review sentiment analysis</p>
          </div>
          <button className="cta-button">Edit Model</button>
        </div>

        <div className="overview-detail-row">
          <div className="detail-pill">Natural Language Processing</div>
          <div>Owner: John Owner</div>
          <div>Created: 1/10/2024</div>
          <div>Updated: 2/18/2024</div>
        </div>
      </section>
    </div>
  );
}

export default OwnerDashboard;
