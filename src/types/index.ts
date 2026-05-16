// ─── Action Item Types ──────────────────────────────────────
export type ActionItemStatus = "pending" | "completed" | "delayed" | "unable_to_complete";
export type ActionItemPriority = "high" | "medium" | "low";

export interface ActionItem {
  id: string;
  taskId?: string; // Task identifier (may be same as id or different)
  task: string;
  responsiblePerson: string;
  responsibleEmail: string | null;
  deadline: string;
  priority: ActionItemPriority;
  status: ActionItemStatus;
  remarks: string | null;
  completionDescription: string | null;
  unableToCompleteReason: string | null;
  createdAt: string;
  updatedAt: string;
  // Enriched fields (added by frontend from meeting context)
  meetingId?: string;
  meetingTitle?: string;
  meetingDate?: string;
  organizationId?: string;
  organizationName?: string;
}

// ─── Organization Types ─────────────────────────────────────
export interface Organization {
  id: string; // Organization identifier
  name: string; // From admin's user doc or userSettings
  adminEmail: string;
}

// ─── Meeting Types ──────────────────────────────────────────
export interface Meeting {
  id: string;
  title: string;
  date: string;
  userId: string; // Admin who owns the meeting
}

// ─── Member User Profile ────────────────────────────────────
export interface MemberProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: "member";
  enrolledOrganizations: string[];
  selectedOrganizationId?: string;
}

// ─── Filter Types ───────────────────────────────────────────
export type StatusFilter = "all" | "pending" | "completed" | "delayed" | "unable_to_complete";

// ─── Stats ──────────────────────────────────────────────────
export interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
  delayed: number;
  overdue: number;
}

// ─── Navigation ─────────────────────────────────────────────
export type Page = "login" | "signup" | "org-select" | "dashboard" | "profile";
