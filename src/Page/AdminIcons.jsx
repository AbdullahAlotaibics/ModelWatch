import React from "react";

function IconBase({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ChartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-3" />
    </IconBase>
  );
}

export function DashboardIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="4" rx="1.5" />
      <rect x="14" y="10" width="7" height="11" rx="1.5" />
      <rect x="3" y="13" width="7" height="8" rx="1.5" />
    </IconBase>
  );
}

export function UsersIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M20 8a3 3 0 0 0-2.5-2.95" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    </IconBase>
  );
}

export function FolderTreeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 6h7" />
      <path d="M7 6v5" />
      <rect x="3" y="3" width="8" height="4" rx="1.5" />
      <rect x="13" y="10" width="8" height="4" rx="1.5" />
      <rect x="3" y="17" width="8" height="4" rx="1.5" />
      <path d="M7 11h10" />
      <path d="M7 11v6" />
    </IconBase>
  );
}

export function AlertCircleIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </IconBase>
  );
}

export function CheckCircleIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3L15.8 9.5" />
    </IconBase>
  );
}

export function ClockIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

export function LogOutIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </IconBase>
  );
}

export function SearchIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function PlusIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

export function EditIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9" />
      <path d="m16.5 3.5 4 4L8 20l-4 1 1-4Z" />
    </IconBase>
  );
}

export function TrashIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconBase>
  );
}

export function CloseIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconBase>
  );
}
