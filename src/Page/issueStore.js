const ISSUES_KEY = "modelwatch_admin_issues";

const starterIssues = [
  {
    id: "1",
    title: "Bias detected in credit risk model",
    description:
      "A reviewer flagged uneven approval rates across protected groups in the latest evaluation run.",
    reportedBy: "Sarah Analyst",
    createdAt: "2026-04-02",
    status: "open",
    modelName: "Credit Risk Classifier",
    reason: "Fairness concern",
    resolutionNote: "",
  },
  {
    id: "2",
    title: "Missing model card details",
    description:
      "The deployment record was published without the required documentation for intended use and limitations.",
    reportedBy: "John Owner",
    createdAt: "2026-04-05",
    status: "in-review",
    modelName: "Sentiment Analysis BERT",
    reason: "Documentation gap",
    resolutionNote: "",
  },
  {
    id: "3",
    title: "Resolved drift alert investigation",
    description:
      "A production model drift alert was reviewed and the threshold configuration was updated.",
    reportedBy: "Admin User",
    createdAt: "2026-04-07",
    status: "resolved",
    modelName: "Demand Forecasting v2",
    reason: "Monitoring alert",
    resolutionNote:
      "Adjusted the alert threshold and documented the updated monitoring baseline.",
  },
];

export function getAllIssues() {
  const stored = localStorage.getItem(ISSUES_KEY);

  if (!stored) {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(starterIssues));
    return starterIssues;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(starterIssues));
    return starterIssues;
  }
}

export function saveAllIssues(issues) {
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
}

export function createIssue(issue) {
  const issues = getAllIssues();
  const newIssue = {
    ...issue,
    id: String(Date.now()),
    createdAt: new Date().toISOString().slice(0, 10),
    status: "open",
    resolutionNote: "",
  };

  const updatedIssues = [newIssue, ...issues];
  saveAllIssues(updatedIssues);
  return newIssue;
}

export function updateIssue(issueId, updates) {
  const updatedIssues = getAllIssues().map((issue) =>
    issue.id === issueId ? { ...issue, ...updates } : issue
  );

  saveAllIssues(updatedIssues);
  return updatedIssues;
}