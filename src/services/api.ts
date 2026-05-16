import type { ActionItem, Organization, Meeting, DashboardStats } from "../types";

export type Unsubscribe = () => void;

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function todayISO(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

const DEMO_ORGS: Organization[] = [
  { id: "org_demo_1", name: "Acme Sales", adminEmail: "admin@acme.example" },
  { id: "org_demo_2", name: "Northwind Team", adminEmail: "lead@northwind.example" },
];

const DEMO_MEETINGS_BY_ORG: Record<string, Meeting[]> = {
  org_demo_1: [
    { id: "m_demo_1", title: "Weekly Pipeline Review", date: todayISO(-7), userId: "org_demo_1" },
    { id: "m_demo_2", title: "Deal Strategy Sync", date: todayISO(-2), userId: "org_demo_1" },
  ],
  org_demo_2: [
    { id: "m_demo_3", title: "Customer Success Standup", date: todayISO(-3), userId: "org_demo_2" },
  ],
};

type Subscriber = {
  orgId: string;
  memberEmail: string;
  callback: (items: ActionItem[]) => void;
};

const subscribers: Subscriber[] = [];
const storeByKey = new Map<string, ActionItem[]>();

function keyFor(orgId: string, memberEmail: string) {
  return `${orgId}::${normalizeEmail(memberEmail)}`;
}

function seedDemoItems(orgId: string, memberEmail: string): ActionItem[] {
  const email = normalizeEmail(memberEmail);
  const meetings = DEMO_MEETINGS_BY_ORG[orgId] || [];
  const [m1, m2] = meetings;
  const createdAt = todayISO(-10);
  const updatedAt = todayISO(-1);

  const meeting1 = m1 || { id: `m_${orgId}_1`, title: "Team Sync", date: todayISO(-7), userId: orgId };
  const meeting2 = m2 || { id: `m_${orgId}_2`, title: "Action Items Review", date: todayISO(-2), userId: orgId };

  return [
    {
      id: "ai_demo_1",
      taskId: "TASK-101",
      task: "Send follow-up email to the prospect",
      responsiblePerson: "You",
      responsibleEmail: email,
      deadline: todayISO(-1),
      priority: "high",
      status: "pending",
      remarks: null,
      completionDescription: null,
      unableToCompleteReason: null,
      createdAt,
      updatedAt,
      meetingId: meeting1.id,
      meetingTitle: meeting1.title,
      meetingDate: meeting1.date,
      organizationId: orgId,
    },
    {
      id: "ai_demo_2",
      taskId: "TASK-102",
      task: "Prepare a 1-page proposal outline",
      responsiblePerson: "You",
      responsibleEmail: email,
      deadline: todayISO(2),
      priority: "medium",
      status: "delayed",
      remarks: "Waiting on pricing confirmation",
      completionDescription: null,
      unableToCompleteReason: null,
      createdAt,
      updatedAt,
      meetingId: meeting1.id,
      meetingTitle: meeting1.title,
      meetingDate: meeting1.date,
      organizationId: orgId,
    },
    {
      id: "ai_demo_3",
      taskId: "TASK-203",
      task: "Book a demo with the stakeholder group",
      responsiblePerson: "You",
      responsibleEmail: email,
      deadline: todayISO(5),
      priority: "low",
      status: "completed",
      remarks: null,
      completionDescription: "Scheduled demo for next Tuesday.",
      unableToCompleteReason: null,
      createdAt,
      updatedAt,
      meetingId: meeting2.id,
      meetingTitle: meeting2.title,
      meetingDate: meeting2.date,
      organizationId: orgId,
    },
  ];
}

function getStore(orgId: string, memberEmail: string) {
  const key = keyFor(orgId, memberEmail);
  const existing = storeByKey.get(key);
  if (existing) return existing;
  const seeded = seedDemoItems(orgId, memberEmail);
  storeByKey.set(key, seeded);
  return seeded;
}

function notifyAll() {
  for (const s of subscribers) {
    s.callback([...getStore(s.orgId, s.memberEmail)]);
  }
}

// ─── Organization Discovery ──────────────────────────────────
/**
 * Find all organizations (admins) whose members list contains this email.
 * members collection: { userId, email, name, ... }
 */
export async function discoverOrganizations(email: string): Promise<Organization[]> {
  void email;
  // Demo-only: return static orgs (no network, no permissions)
  return DEMO_ORGS;
}

// ─── Meetings ────────────────────────────────────────────────
/**
 * Demo meetings for a given organization (frontend-only)
 */
export async function getMeetingsForOrg(orgId: string): Promise<Meeting[]> {
  return DEMO_MEETINGS_BY_ORG[orgId] || [];
}

// ─── Action Items (Demo Store) ───────────────────────────────
/**
 * Subscribe to action items for a member across all meetings in an organization.
 * In demo mode, this is an in-memory pub/sub store (no network).
 */
export function subscribeToMemberActionItems(
  orgId: string,
  memberEmail: string,
  callback: (items: ActionItem[]) => void
): Unsubscribe {
  const normalizedEmail = normalizeEmail(memberEmail);
  const subscriber: Subscriber = { orgId, memberEmail: normalizedEmail, callback };
  subscribers.push(subscriber);

  // Immediate emit (mimics a real-time subscription)
  callback([...getStore(orgId, normalizedEmail)]);

  return () => {
    const idx = subscribers.indexOf(subscriber);
    if (idx >= 0) subscribers.splice(idx, 1);
  };
}

/**
 * Get all action items for a member (one-time fetch, no real-time)
 */
export async function getAllActionItemsForMember(
  orgId: string,
  memberEmail: string
): Promise<ActionItem[]> {
  return [...getStore(orgId, memberEmail)];
}

// ─── Status Update (Demo Store) ──────────────────────────────
/**
 * Update action item status in the in-memory demo store.
 */
export async function updateActionItemStatus(
  meetingId: string,
  _orgId: string, // kept for backward compatibility
  taskId: string,
  updates: {
    status: string;
    completionDescription?: string;
    unableToCompleteReason?: string;
    remarks?: string;
  }
): Promise<boolean> {
  void _orgId;
  const nextStatus = updates.status.toLowerCase();

  let updated = false;
  for (const [key, items] of storeByKey.entries()) {
    const idx = items.findIndex((i) => (i.id === taskId || i.taskId === taskId) && (i.meetingId || "") === meetingId);
    if (idx < 0) continue;

    const current = items[idx];
    items[idx] = {
      ...current,
      status: nextStatus as any,
      completionDescription:
        updates.completionDescription !== undefined
          ? updates.completionDescription
          : current.completionDescription,
      unableToCompleteReason:
        updates.unableToCompleteReason !== undefined
          ? updates.unableToCompleteReason
          : current.unableToCompleteReason,
      remarks: updates.remarks !== undefined ? updates.remarks : current.remarks,
      updatedAt: new Date().toISOString(),
    };
    storeByKey.set(key, items);
    updated = true;
  }

  if (updated) notifyAll();
  return true;
}

// ─── Stats Computation ──────────────────────────────────────
export function computeStats(items: ActionItem[]): DashboardStats {
  const now = new Date();
  let overdue = 0;

  for (const item of items) {
    if (item.status === "pending" || item.status === "delayed") {
      const deadline = new Date(item.deadline);
      if (deadline < now) overdue++;
    }
  }

  return {
    total: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    completed: items.filter((i) => i.status === "completed").length,
    delayed: items.filter((i) => i.status === "delayed").length,
    overdue,
  };
}
