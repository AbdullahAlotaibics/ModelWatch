import React from "react";

function OwnerCompare() {
  return (
    <div className="page-shell">
      <section className="page-title-section">
        <div>
          <h1>Compare Models</h1>
          <p>Review model performance side by side to find the best fit for your use case.</p>
        </div>
      </section>

      <section className="compare-panel">
        <div className="compare-card">
          <h3>Model A</h3>
          <p>Customer Churn Predictor</p>
          <ul>
            <li>Accuracy: 89%</li>
            <li>Type: Random Forest</li>
            <li>Owner: John Owner</li>
          </ul>
        </div>
        <div className="compare-card">
          <h3>Model B</h3>
          <p>Sentiment Analysis BERT</p>
          <ul>
            <li>Accuracy: 92%</li>
            <li>Type: NLP / Transformer</li>
            <li>Owner: Sarah Analyst</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default OwnerCompare;
