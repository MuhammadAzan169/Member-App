import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  Home,
  User,
  RefreshCw,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { subscribeToMemberActionItems, computeStats } from "../../services/api";
import { ActionItemCard } from "./ActionItemCard";
import { ActionItemDetail } from "./ActionItemDetail";
import { ProfileScreen } from "./ProfileScreen";
import type { ActionItem, Organization, StatusFilter, ActionItemStatus } from "../../types";

interface DashboardProps {
  organization: Organization;
  onSwitchOrg: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  organization,
  onSwitchOrg,
  onLogout,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"home" | "profile">("home");
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unsubscribeRef = useRef<null | (() => void)>(null);

  // Set up real-time listener for action items
  useEffect(() => {
    if (!user?.email || !organization?.id) return;

    setLoading(true);

    // Subscribe to real-time updates
    unsubscribeRef.current = subscribeToMemberActionItems(
      organization.id,
      user.email,
      (fetchedItems) => {
        setItems(fetchedItems);
        setLoading(false);
        setRefreshing(false);
      }
    );

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [organization.id, user?.email]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Real-time listener will automatically update and set refreshing to false
    // But we'll set a timeout just in case
    setTimeout(() => setRefreshing(false), 1000);
    toast.success("Refreshed!");
  };

  const handleStatusUpdated = (
    taskId: string,
    newStatus: ActionItemStatus,
    extra?: Record<string, string>
  ) => {
    // Real-time listener will update the items automatically
    // No need to manually update state here
    toast.success("Status updated!");
    setSelectedItem(null);
  };

  const stats = useMemo(() => computeStats(items), [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch =
          item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.meetingTitle || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
          statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        // Sort: overdue first, then by deadline
        const aDate = new Date(a.deadline).getTime();
        const bDate = new Date(b.deadline).getTime();
        if (a.status === "completed" && b.status !== "completed") return 1;
        if (a.status !== "completed" && b.status === "completed") return -1;
        return aDate - bDate;
      });
  }, [items, searchQuery, statusFilter]);

  // Group by meeting
  const groupedItems = useMemo(() => {
    const groups: Record<string, { title: string; date: string; items: ActionItem[] }> = {};
    for (const item of filteredItems) {
      const key = item.meetingId || "unknown";
      if (!groups[key]) {
        groups[key] = {
          title: item.meetingTitle || "Unknown Meeting",
          date: item.meetingDate || "",
          items: [],
        };
      }
      groups[key].items.push(item);
    }
    return Object.entries(groups);
  }, [filteredItems]);

  const filterTabs: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Delayed", value: "delayed" },
  ];

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: <ListTodo size={18} className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <Clock size={18} className="text-amber-500" />,
      bg: "bg-amber-50",
    },
    {
      label: "Done",
      value: stats.completed,
      icon: <CheckCircle2 size={18} className="text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: <AlertTriangle size={18} className="text-red-500" />,
      bg: "bg-red-50",
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo & Org */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
            M
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900">MeetingSense</h1>
            <button
              onClick={onSwitchOrg}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors truncate"
            >
              <Building2 size={10} />
              <span className="truncate">{organization.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => {
            setActiveTab("home");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
            activeTab === "home"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Home size={20} />
          <span>My Tasks</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("profile");
            setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
            activeTab === "profile"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.displayName || "Member"}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col h-full bg-[#FAFBFF]">
      {/* Header - Mobile */}
      <header className="md:hidden px-6 pt-12 pb-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">My Tasks</h1>
              <button
                onClick={onSwitchOrg}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Building2 size={10} />
                {organization.name}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 transition-all ${
                refreshing ? "animate-spin" : ""
              }`}
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm"
            >
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks or meetings..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Header - Desktop */}
      <header className="hidden md:flex px-8 pt-8 pb-4 bg-white border-b border-gray-100 shrink-0 items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Tasks</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your action items</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all ${
              refreshing ? "animate-spin" : ""
            }`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 md:px-8 py-4 shrink-0">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center"
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 ${stat.bg} rounded-lg md:rounded-xl flex items-center justify-center mb-1 md:mb-2`}>
                {stat.icon}
              </div>
              <span className="text-lg md:text-2xl font-black text-gray-900 leading-none">
                {stat.value}
              </span>
              <span className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-tighter mt-0.5 md:mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 md:px-8 pb-3 overflow-x-auto shrink-0">
        <div className="flex gap-6 md:gap-8">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="relative py-2 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <span className={statusFilter === tab.value ? "text-blue-600" : "text-gray-400"}>
                {tab.label}
              </span>
              {statusFilter === tab.value && (
                <motion.div
                  layoutId="statusFilter"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search - Desktop */}
      <div className="hidden md:block px-8 pb-4 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks or meetings..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Task List */}
      <main className="flex-1 overflow-y-auto px-6 md:px-8 pb-24 md:pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Loading tasks...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <ListTodo className="text-gray-300" size={28} />
            </div>
            <h3 className="font-bold text-gray-500 mb-1">No tasks found</h3>
            <p className="text-gray-400 text-sm">
              {statusFilter !== "all"
                ? `No ${statusFilter} tasks`
                : "You don't have any action items yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {groupedItems.map(([meetingId, group]) => (
              <div key={meetingId}>
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest truncate">
                    {group.title}
                  </h3>
                  {group.date && (
                    <span className="text-[10px] text-gray-300 shrink-0">
                      • {group.date}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {group.items.map((item) => (
                      <ActionItemCard
                        key={`${meetingId}-${item.id}`}
                        item={item}
                        onClick={setSelectedItem}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Action Item Detail */}
      <AnimatePresence>
        {selectedItem && (
          <ActionItemDetail
            item={selectedItem}
            onBack={() => setSelectedItem(null)}
            onStatusUpdated={handleStatusUpdated}
          />
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-gray-100 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "home" ? (
              renderHome()
            ) : (
              <ProfileScreen
                organization={organization}
                onSwitchOrg={onSwitchOrg}
                onLogout={onLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - Mobile/Tablet only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 px-16 flex items-center justify-around text-gray-400 pb-4 z-30">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "home"
              ? "text-blue-600 scale-110"
              : "hover:text-gray-600"
          }`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === "profile"
              ? "text-gray-900 scale-110"
              : "hover:text-gray-600"
          }`}
        >
          <User size={24} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
};