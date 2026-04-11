import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoredAccount } from "../session";
import { getModelById } from "./modelStore";
import {
  ArrowLeftIcon,
  EyeIcon,
  EditIcon,
  ClockIcon,
  FileTextIcon,
  NoteIcon,
  DownloadIcon,
  FlagIcon,
} from "./OwnerIcons";

const modelExtraDetails = {
  "model-1": {
    title: "Customer Churn Predictor",
    visibility: "public",
    category: "Machine Learning",
    description: "Random Forest model for predicting customer churn with 89% accuracy",
    createdDisplay: "1/15/2024",
    updatedDisplay: "2/20/2024",
    overviewItems: [
      { label: "Algorithm", value: "Random Forest" },
      { label: "Accuracy", value: "89%" },
      { label: "Training Data Size", value: "50,000 records" },
      { label: "Features", value: "15" },
    ],
    files: ["model_config.json", "training_report.pdf"],
    notes: ["Reviewed churn threshold sensitivity"],
    history: [
      {
        text: "Improved model accuracy by 3% through feature engineering",
        author: "John Owner",
        time: "2/20/2024, 1:30:00 PM",
      },
      {
        text: "Initial model deployment to staging environment",
        author: "John Owner",
        time: "1/15/2024, 5:20:00 PM",
      },
    ],
  },
  "model-3": {
    title: "Sentiment Analysis BERT",
    visibility: "public",
    category: "Natural Language Processing",
    description: "Fine-tuned BERT model for customer review sentiment analysis",
    createdDisplay: "1/10/2024",
    updatedDisplay: "2/18/2024",
    overviewItems: [
      { label: "Base Model", value: "BERT-base-uncased" },
      { label: "F1 Score", value: "0.91" },
      { label: "Training Examples", value: "25,000" },
    ],
    files: [],
    notes: [],
    history: [
      {
        text: "Fine-tuned on domain-specific data for better performance",
        author: "John Owner",
        time: "2/18/2024, 4:20:00 PM",
      },
    ],
  },
};

const tabs = ["Overview", "History", "Analytical Notes"];

function formatFallbackDate(dateText) {
  if (!dateText) {
    return "-";
  }
  return new Date(dateText).toLocaleDateString();
}

function ModelDetailsPage() {
  const navigate = useNavigate();
  const { modelId } = useParams();
  const currentUser = getStoredAccount();
  const [activeTab, setActiveTab] = useState("Overview");

  const model = useMemo(() => getModelById(modelId), [modelId]);

  const pageData = useMemo(() => {
    if (!model) {
      return null;
    }

    const extra = modelExtraDetails[model.id];

    return {
      title: extra?.title || model.name,
      visibility: extra?.visibility || model.visibility,
      category: extra?.category || model.category,
      description: extra?.description || model.description,
      ownerName: model.ownerName,
      createdDisplay: extra?.createdDisplay || formatFallbackDate(model.createdAt),
      updatedDisplay: extra?.updatedDisplay || formatFallbackDate(model.updatedAt),
      overviewItems:
        extra?.overviewItems ||
        model.attributes?.map((attribute) => ({
          label: attribute.name,
          value: attribute.value,
        })) ||
        [],
      files: extra?.files || [],
      notes: extra?.notes || model.notes || [],
      history:
        extra?.history ||
        (model.updates || []).map((update) => ({
          text: update,
          author: model.ownerName,
          time: formatFallbackDate(model.updatedAt),
        })),
    };
  }, [model]);

  if (!pageData) {
    return (
      <div className="page-shell">
        <div className="overview-card">
          <h2>Model not found</h2>
          <p>The model you are trying to view does not exist.</p>
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

  const isOwner = currentUser?.role === "owner";
  const isAnalyst = currentUser?.role === "analyst";

  return (
    <div className="page-shell model-details-page">
      <button type="button" className="owner-back-button" onClick={() => navigate(-1)}>
        <ArrowLeftIcon className="owner-inline-icon" />
        <span>Back</span>
      </button>

      <section className="model-hero-card">
        <div className="model-hero-top">
          <div>
            <div className="model-hero-title-row">
              <h1>{pageData.title}</h1>
              <span className={`model-status-badge ${pageData.visibility}`}>
                <EyeIcon className="owner-inline-icon" />
                <span>{pageData.visibility.charAt(0).toUpperCase() + pageData.visibility.slice(1)}</span>
              </span>
            </div>

            <p className="model-hero-description">{pageData.description}</p>

            <div className="model-hero-meta">
              <span className="detail-pill">{pageData.category}</span>
              <span>Owner: {pageData.ownerName}</span>
              <span>Created: {pageData.createdDisplay}</span>
              <span>Updated: {pageData.updatedDisplay}</span>
            </div>
          </div>

          <div className="model-hero-actions">
            {isOwner ? (
              <button
                type="button"
                className="primary-button details-main-action"
                onClick={() => navigate(`/owner/models/${modelId}/edit`)}
              >
                <EditIcon className="owner-inline-icon" />
                <span>Edit Model</span>
              </button>
            ) : null}

            {isAnalyst ? (
              <>
                <button
                  type="button"
                  className="primary-button details-main-action"
                  onClick={() => alert("Export action")}
                >
                  <DownloadIcon className="owner-inline-icon" />
                  <span>Export</span>
                </button>

                <button
                  type="button"
                  className="secondary-button details-main-action"
                  onClick={() => alert("Flag action")}
                >
                  <FlagIcon className="owner-inline-icon" />
                  <span>Flag</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="model-tabs-shell">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`model-tab-button-new${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "Overview" ? <FileTextIcon className="owner-inline-icon" /> : null}
            {tab === "History" ? <ClockIcon className="owner-inline-icon" /> : null}
            {tab === "Analytical Notes" ? <NoteIcon className="owner-inline-icon" /> : null}
            <span>{tab}</span>
          </button>
        ))}
      </section>

      {activeTab === "Overview" ? (
        <>
          <section className="model-overview-grid">
            <article className="details-card-large">
              <h2 className="details-card-title">
                <FileTextIcon className="owner-inline-icon" />
                <span>Model Attributes</span>
              </h2>

              <div className="details-list">
                {pageData.overviewItems.map((item) => (
                  <div key={item.label} className="details-list-row">
                    <strong>{item.label}:</strong>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="details-card-large">
              <h2 className="details-card-title">
                <FileTextIcon className="owner-inline-icon" />
                <span>Attached Files</span>
              </h2>

              {pageData.files.length > 0 ? (
                <div className="details-files-list">
                  {pageData.files.map((file) => (
                    <div key={file} className="details-file-row">
                      <FileTextIcon className="owner-inline-icon" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-copy">No files attached</p>
              )}
            </article>
          </section>

          <section className="details-updates-card">
            <div className="details-section-header">
              <h2 className="details-card-title">
                <ClockIcon className="owner-inline-icon" />
                <span>Recent Model Updates</span>
              </h2>

              {isOwner ? (
                <button
                  type="button"
                  className="text-action-button"
                  onClick={() => navigate(`/owner/models/${modelId}/edit`)}
                >
                  <EditIcon className="owner-inline-icon" />
                  <span>Edit Model</span>
                </button>
              ) : null}
            </div>

            <div className="timeline-list">
              {pageData.history.map((entry, index) => (
                <article key={`${entry.text}-${index}`} className="timeline-card updated-style">
                  <p>{entry.text}</p>
                  <div className="timeline-meta-row">
                    <strong>{entry.author}</strong>
                    <span>{entry.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {activeTab === "History" ? (
        <section className="details-updates-card">
          <h2 className="details-card-title">
            <ClockIcon className="owner-inline-icon" />
            <span>History</span>
          </h2>

          <div className="timeline-list">
            {pageData.history.map((entry, index) => (
              <article key={`${entry.text}-${index}`} className="timeline-card updated-style">
                <p>{entry.text}</p>
                <div className="timeline-meta-row">
                  <strong>{entry.author}</strong>
                  <span>{entry.time}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "Analytical Notes" ? (
        <section className="details-updates-card">
          <h2 className="details-card-title">
            <NoteIcon className="owner-inline-icon" />
            <span>Analytical Notes</span>
          </h2>

          {pageData.notes.length > 0 ? (
            <div className="timeline-list">
              {pageData.notes.map((note, index) => (
                <article key={`${note}-${index}`} className="timeline-card updated-style">
                  <p>{note}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-copy">No analytical notes available.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}

export default ModelDetailsPage;