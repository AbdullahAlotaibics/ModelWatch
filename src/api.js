const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const rawAccount = sessionStorage.getItem("modelwatch-session");

  if (!rawAccount) {
    return {};
  }

  try {
    const account = JSON.parse(rawAccount);
    return account.token ? { Authorization: `Bearer ${account.token}` } : {};
  } catch {
    return {};
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export function normalizeUser(user) {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt ? user.createdAt.slice(0, 10) : "",
  };
}

export function normalizeCategory(category) {
  return {
    id: category.id || category._id,
    name: category.name,
    description: category.description || "",
    createdAt: category.createdAt ? category.createdAt.slice(0, 10) : "",
  };
}

export function normalizeIssue(issue) {
  return {
    id: issue.id || issue._id,
    title: issue.title,
    description: issue.description || "",
    status: issue.status || "open",
    reportedBy:
      issue.reportedBy ||
      issue.reporter?.name ||
      issue.reporter?.email ||
      "Unknown user",
    createdAt: issue.createdAt ? issue.createdAt.slice(0, 10) : "",
    modelId: issue.modelId || "",
    modelName: issue.modelName || issue.modelId || "",
    reason: issue.reason || "",
    resolutionNote: issue.resolutionNote || "",
  };
}

export const api = {
  login(credentials) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  users: {
    list: () => request("/users").then((users) => users.map(normalizeUser)),
    create: (user) =>
      request("/users", {
        method: "POST",
        body: JSON.stringify(user),
      }).then(normalizeUser),
    update: (id, user) =>
      request(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(user),
      }),
    remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
  },

  categories: {
    list: () => request("/categories").then((categories) => categories.map(normalizeCategory)),
    create: (category) =>
      request("/categories", {
        method: "POST",
        body: JSON.stringify(category),
      }).then(normalizeCategory),
    update: (id, category) =>
      request(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(category),
      }).then((response) => normalizeCategory(response.category)),
    remove: (id) => request(`/categories/${id}`, { method: "DELETE" }),
  },

  issues: {
    list: () => request("/issues").then((issues) => issues.map(normalizeIssue)),
    create: (issue) =>
      request("/issues", {
        method: "POST",
        body: JSON.stringify(issue),
      }).then(normalizeIssue),
    update: (id, issue) =>
      request(`/issues/${id}`, {
        method: "PUT",
        body: JSON.stringify(issue),
      }).then((response) => normalizeIssue(response.issue)),
    remove: (id) => request(`/issues/${id}`, { method: "DELETE" }),
  },
};
