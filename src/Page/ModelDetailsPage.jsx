import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoredAccount } from "../session";
import { api } from "../api";
import { getModelById, updateModel } from "./modelStore";
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
  const [currentModel, setCurrentModel] = useState(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagSeverity, setFlagSeverity] = useState("medium");
  const [flagComment, setFlagComment] = useState("");
  const [flagError, setFlagError] = useState("");
  const [flagSuccess, setFlagSuccess] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState("");
  const [noteSuccess, setNoteSuccess] = useState("");

  const model = useMemo(() => getModelById(modelId), [modelId]);
  useEffect (() => {
    setCurrentModel(model || null)
  }, [model]);

  const pageData = useMemo(() => {
    if (!currentModel) {
      return null;
    }

    const extra = modelExtraDetails[currentModel.id];

    return {
      title: extra?.title || currentModel.name,
      visibility: extra?.visibility || currentModel.visibility,
      category: extra?.category || currentModel.category,
      description: extra?.description || currentModel.description,
      ownerName: currentModel.ownerName,
      createdDisplay: extra?.createdDisplay || formatFallbackDate(currentModel.createdAt),
      updatedDisplay: extra?.updatedDisplay || formatFallbackDate(currentModel.updatedAt),
      overviewItems:
        extra?.overviewItems ||
        currentModel.attributes?.map((attribute) => ({
          label: attribute.name,
          value: attribute.value,
        })) ||
        [],
      files: extra?.files || [],
      notes: (currentModel.notes && currentModel.notes.length > 0)
      ? currentModel.notes
      : (extra?.notes || []),
      history:
        currentModel.updates && currentModel.updates.length > 0
    ? currentModel.updates.map((update) => ({
        text: update,
        author: currentModel.ownerName,
        time: formatFallbackDate(currentModel.updatedAt),
      }))
    : (extra?.history || []),
    };
  }, [currentModel]);

  const handleAddNote = (event) => {
  event.preventDefault();

  if (!noteText.trim()) {
    setNoteError("Note cannot be empty.");
    return;
  }

  const updatedModel = {
    ...currentModel,
    notes: [...(currentModel.notes || []), noteText.trim()],
    updatedAt: new Date().toISOString().slice(0, 10),
    updates: [...(currentModel.updates || []), "Analytical note added"],
  };

  updateModel(updatedModel);
  setCurrentModel(updatedModel);
  setNoteText("");
  setNoteError("");
  setNoteSuccess("Analytical note added successfully.");
};

  const openFlagModal = () => {
  setIsFlagModalOpen(true);
  setFlagError("");
  setFlagSuccess("");
};

const closeFlagModal = () => {
  setIsFlagModalOpen(false);
  setFlagReason("");
  setFlagSeverity("medium");
  setFlagComment("");
  setFlagError("");
};

const handleFlagSubmit = async (event) => {
  event.preventDefault();

  if (!flagReason.trim()) {
    setFlagError("Reason is required.");
    return;
  }

    const newFlag = {
      id: `flag-${Date.now()}`,
      reason: flagReason.trim(),
      severity: flagSeverity,
      comment: flagComment.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      createdBy: currentUser?.label || currentUser?.email || "User",
      status: "open",
    };

    const newIssue = {
      title: `Flagged model: ${currentModel.name}`,
      description: flagComment.trim() || flagReason.trim(),
      reportedBy: currentUser?.label || currentUser?.email || "User",
      modelName: currentModel.name,
      reason: flagReason.trim(),
    };

    const updatedModel = {
      ...currentModel,
      flags: [...(currentModel.flags || []), newFlag],
      updatedAt: new Date().toISOString().slice(0, 10),
      updates: [...(currentModel.updates || []), `Model flagged: ${flagReason.trim()}`],
    };

    try {
      await api.issues.create({
        ...newIssue,
        modelId: currentModel.id,
      });
      updateModel(updatedModel);
      setFlagSuccess("Model flagged successfully.");
      setCurrentModel(updatedModel);
      closeFlagModal();
    } catch (requestError) {
      setFlagError(requestError.message || "Unable to submit flag.");
    }
  };

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

      {flagSuccess ? <div className="success-message">{flagSuccess}</div> : null}

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
                  onClick={openFlagModal}
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

      <form onSubmit={handleAddNote} className="model-note-form">
        <textarea
          className="modal-textarea"
          rows="4"
          placeholder="Add an analytical note..."
          value={noteText}
          onChange={(event) => {
            setNoteText(event.target.value);
            if (noteError) setNoteError("");
            if (noteSuccess) setNoteSuccess("");
          }}
        />

        {noteError ? <div className="inline-error">{noteError}</div> : null}
        {noteSuccess ? <div className="success-message">{noteSuccess}</div> : null}

        <div className="modal-actions">
          <button type="submit" className="primary-btn">Add Note</button>
        </div>
      </form>

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

    {isFlagModalOpen ? (
    <div className="modal-backdrop" onClick={closeFlagModal}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Flag Model</h2>
            <p>Report an issue or concern for this model.</p>
          </div>

          <button type="button" className="modal-close-btn" onClick={closeFlagModal}>
            ×
          </button>
        </div>

        <form onSubmit={handleFlagSubmit} className="modal-form">
          <label className="modal-field">
            <span>Reason</span>
            <input
              type="text"
              value={flagReason}
              onChange={(event) => setFlagReason(event.target.value)}
              placeholder="e.g. Data drift detected"
            />
          </label>

          <label className="modal-field">
            <span>Severity</span>
            <select
              value={flagSeverity}
              onChange={(event) => setFlagSeverity(event.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="modal-field">
            <span>Comment</span>
            <textarea
              className="modal-textarea"
              value={flagComment}
              onChange={(event) => setFlagComment(event.target.value)}
              placeholder="Add details"
              rows="4"
            />
          </label>

          {flagError ? <div className="inline-error">{flagError}</div> : null}

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={closeFlagModal}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Submit Flag
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null}
    </div>
  );
}

export default ModelDetailsPage;
