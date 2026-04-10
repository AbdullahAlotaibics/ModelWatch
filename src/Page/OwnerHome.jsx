import React from "react";
import { getStoredAccount } from "../session";
import AnalystDashboard from "./AnalystDashboard";
import OwnerDashboard from "./OwnerDashboard";

function OwnerHome() {
  const currentUser = getStoredAccount();

  if (currentUser?.role === "analyst") {
    return <AnalystDashboard />;
  }

  return <OwnerDashboard />;
}

export default OwnerHome;
