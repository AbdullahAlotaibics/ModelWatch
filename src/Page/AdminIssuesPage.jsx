import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AlertCircleIcon, CheckCircleIcon, ClockIcon } from "./AdminIcons";

function getStatusIcon(status) {
  if (status === "resolved") {
    return <CheckCircleIcon className="issue-status-icon resolved" />;
  }

  if (status === "in-review") {
    return <ClockIcon className="issue-status-icon in-review" />;
  }

  return <AlertCircleIcon className="issue-status-icon open" />;
}

function formatStatus(status) {
  return status.replace("-", " ");
}

function AdminIssuesPage() {
  const { issues, updateIssue } = useOutletContext();
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const selectedIssue = useMemo(
    () => issues.find((issue) => issue.id === selectedIssueId) || null,
    [issues, selectedIssueId]
  );

  const handleSelectIssue = (issueId) => {
    const nextIssue = issues.find((issue) => issue.id === issueId);
    setSelectedIssueId(issueId);
    setResolutionNote(nextIssue?.resolutionNote || "");
  };

  const handleStatusChange = (issueId, newStatus) => {
    const nextUpdates =
      newStatus === "resolved"
        ? { status: newStatus, resolutionNote: resolutionNote.trim() }
        : { status: newStatus };

    updateIssue(issueId, nextUpdates);
  };

  const handleResolve = () => {
    if (!selectedIssue || !resolutionNote.trim()) {
      return;
    }

    updateIssue(selectedIssue.id, {
      status: "resolved",
      resolutionNote: resolutionNote.trim(),
    });
  };

  return (
    <div className="admin-section">
      <div className="dashboard-header">
        <h1>Issue Management</h1>
        <p>Review and resolve reported issues.</p>
      </div>

      <div className="issues-layout">
        <section className="issues-list">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className={`issue-card${selectedIssueId === issue.id ? " selected" : ""}`}
              onClick={() => handleSelectIssue(issue.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelectIssue(issue.id);
                }
              }}
            >
              <div className="issue-card-header">
                <div className="issue-card-title">
                  {getStatusIcon(issue.status)}
                  <h3>{issue.title}</h3>
                </div>

                <span className={`issue-badge ${issue.status}`}>{formatStatus(issue.status)}</span>
              </div>

              <p className="issue-description">{issue.description}</p>

              <div className="issue-meta-row">
                <span>Reported by: {issue.reportedBy}</span>
                <span>{issue.createdAt}</span>
              </div>

              {issue.modelName ? (
                <div className="issue-model-row">
                  <span>
                    Model: <strong>{issue.modelName}</strong>
                  </span>
                  {issue.reason ? (
                    <span>
                      Reason: <strong>{issue.reason}</strong>
                    </span>
                  ) : null}
                </div>
              ) : null}

              {issue.resolutionNote ? (
                <div className="resolution-box">
                  <p>
                    <strong>Resolution:</strong> {issue.resolutionNote}
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </section>

        <aside className="issue-details-card">
          <h2>Issue Details</h2>

          {selectedIssue ? (
            <div className="issue-details-body">
              <div className="detail-group">
                <label>Title</label>
                <p>{selectedIssue.title}</p>
              </div>

              <div className="detail-group">
                <label>Description</label>
                <p>{selectedIssue.description}</p>
              </div>

              <div className="detail-group">
                <label>Status</label>
                <select
                  value={selectedIssue.status}
                  onChange={(event) => handleStatusChange(selectedIssue.id, event.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in-review">In Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {selectedIssue.status !== "resolved" ? (
                <div className="detail-group">
                  <label>Resolution Note</label>
                  <textarea
                    className="modal-textarea"
                    rows="4"
                    placeholder="Add resolution details..."
                    value={resolutionNote}
                    onChange={(event) => setResolutionNote(event.target.value)}
                  />
                  <button
                    type="button"
                    className="resolve-btn"
                    onClick={handleResolve}
                    disabled={!resolutionNote.trim()}
                  >
                    Mark as Resolved
                  </button>
                </div>
              ) : null}

              {selectedIssue.resolutionNote ? (
                <div className="resolution-box">
                  <p>
                    <strong>Resolution:</strong> {selectedIssue.resolutionNote}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="issue-empty-copy">Select an issue to view details.</p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default AdminIssuesPage;
