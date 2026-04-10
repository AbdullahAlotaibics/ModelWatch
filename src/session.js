const SESSION_KEY = "modelwatch-session";

export const demoAccounts = [
  { label: "Admin User", role: "admin", email: "admin@modelwatch.com", password: "admin123" },
  { label: "John Owner", role: "owner", email: "owner@modelwatch.com", password: "owner123" },
  { label: "Sarah Analyst", role: "analyst", email: "analyst@modelwatch.com", password: "analyst123" },
];

export function getStoredAccount() {
  const rawAccount = sessionStorage.getItem(SESSION_KEY);

  if (!rawAccount) {
    return null;
  }

  try {
    return JSON.parse(rawAccount);
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeAccount(account) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
}

export function clearStoredAccount() {
  sessionStorage.removeItem(SESSION_KEY);
}
