const API = "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`${data?.message || "Request failed"}: ${data?.error || ""}`);
  }

  return data;
}

async function run() {
  console.log("Starting API tests...");

  const login = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "owner@modelwatch.com",
      password: "owner123",
    }),
  });

  const auth = {
    Authorization: `Bearer ${login.token}`,
  };

  console.log("Login OK");

  const created = await request("/models", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      name: "Test Model",
      description: "Test description",
      category: "Machine Learning",
      visibility: "private",
      attributes: [{ name: "Accuracy", value: "90%" }],
    }),
  });

  const id = created.id || created._id;

  console.log("Create OK");

  await request("/models", { headers: auth });
  console.log("List OK");

  await request(`/models/${id}`, { headers: auth });
  console.log("Get OK");

  await request(`/models/${id}`, {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({
      name: "Updated Model",
      description: "Updated",
      category: "Machine Learning",
      visibility: "public",
      attributes: [{ name: "Accuracy", value: "95%" }],
    }),
  });

  console.log("Update OK");

  await request(`/models/${id}`, {
    method: "DELETE",
    headers: auth,
  });

  console.log("Delete OK");

  console.log("All tests passed ✅");
}

run().catch((error) => {
  console.error("Test failed:", error.message);
});