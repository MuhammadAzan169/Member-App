import React, { useState } from "react";
import {
  ChevronLeft,
  Calendar,
  Tag,
  Clock,
  AlignLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  XCircle,
  Building2,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn, formatDate, isOverdue, relativeTime } from "../../lib/utils";
import { updateActionItemStatus } from "../../services/api";
import type { ActionItem, ActionItemStatus } from "../../types";

interface ActionItemDetailProps {
  item: ActionItem;
  onBack: () => void;
  onStatusUpdated: (taskId: string, newStatus: ActionItemStatus, extra?: Record<string, string>) => void;
}

type UpdateAction = "completed" | "delayed" | "unable_to_complete";

export const ActionItemDetail: React.FC<ActionItemDetailProps> = ({
  item,
  onBack,
  onStatusUpdated,
}) => {
  const [showForm, setShowForm] = useState<UpdateAction | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const overdue = isOverdue(item.deadline, item.status);

  const priorityConfig: Record<string, { color: string; label: string; bg: string }> = {
    high: { color: "text-red-600", label: "High Priority", bg: "bg-red-50" },
    medium: { color: "text-amber-600", label: "Medium Priority", bg: "bg-amber-50" },
    low: { color: "text-emerald-600", label: "Low Priority", bg: "bg-emerald-50" },
  };

  const config = priorityConfig[item.priority] || priorityConfig.medium;

  const handleStatusUpdate = async (action: UpdateAction) => {
    if (action === "completed" || action === "unable_to_complete") {
      if (!description.trim()) {
        toast.error(
          action === "completed"
            ? "Please describe what was completed"
            : "Please provide a reason"
        );
        return;
      }
    }

    if (!item.meetingId || !item.organizationId) {
      toast.error("Missing meeting information");
      return;
    }

    setIsSubmitting(true);
    try {
      const updates: { status: string; completionDescription?: string; unableToCompleteReason?: string; remarks?: string } = { status: action };
      if (action === "completed") updates.completionDescription = description;
      if (action === "unable_to_complete") updates.unableToCompleteReason = description;
      if (action === "delayed") updates.remarks = description || "Delayed by member";

      const success = await updateActionItemStatus(
        item.meetingId,
        item.organizationId,
        item.id,
        updates
      );

      if (success) {
        toast.success(
          action === "completed"
            ? "Task marked as completed!"
            : action === "delayed"
            ? "Task marked as delayed"
            : "Status updated"
        );
        onStatusUpdated(item.id, action, updates);
        onBack();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formLabels: Record<UpdateAction, { title: string; placeholder: string }> = {
    completed: {
      title: "Completion Details",
      placeholder: "Describe what was done, results achieved, etc.",
    },
    delayed: {
      title: "Delay Reason (Optional)",
      placeholder: "Why is this task delayed?",
    },
    unable_to_complete: {
      title: "Reason",
      placeholder: "Explain why this task cannot be completed...",
    },
  };

  // Content JSX - not wrapped in a function to prevent re-renders
  const contentJSX = (
    <div className="space-y-5 md:space-y-6">
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.bg} ${config.color}`}>
          {config.label}
        </div>
        {overdue && (
          <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600">
            Overdue
          </div>
        )}
        <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 capitalize">
          {item.status.replace(/_/g, " ")}
        </div>
      </div>

      {/* Title */}
      <h2
        className={cn(
          "text-xl md:text-2xl font-black text-gray-900 leading-tight",
          item.status === "completed" && "line-through opacity-50"
        )}
      >
        {item.task}
      </h2>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-[20px] border border-gray-100">
          <div className="text-gray-400 mb-1.5 md:mb-2">
            <Calendar size={16} />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Deadline
          </div>
          <div className={cn("text-sm font-bold text-gray-900", overdue && "text-red-600")}>
            {formatDate(item.deadline)}
          </div>
          <div className={cn("text-[10px] mt-0.5", overdue ? "text-red-400" : "text-gray-400")}>
            {relativeTime(item.deadline)}
          </div>
        </div>

        <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-[20px] border border-gray-100">
          <div className="text-gray-400 mb-1.5 md:mb-2">
            <Clock size={16} />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Status
          </div>
          <div className="text-sm font-bold text-gray-900 capitalize">
            {item.status.replace(/_/g, " ")}
          </div>
        </div>

        {item.meetingTitle && (
          <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-[20px] border border-gray-100">
            <div className="text-gray-400 mb-1.5 md:mb-2">
              <Tag size={16} />
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              Meeting
            </div>
            <div className="text-sm font-bold text-gray-900 truncate">
              {item.meetingTitle}
            </div>
          </div>
        )}

        {item.meetingDate && (
          <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-[20px] border border-gray-100">
            <div className="text-gray-400 mb-1.5 md:mb-2">
              <Calendar size={16} />
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              Meeting Date
            </div>
            <div className="text-sm font-bold text-gray-900">
              {formatDate(item.meetingDate)}
            </div>
          </div>
        )}
      </div>

      {/* Assigned To */}
      <div className="space-y-2 md:space-y-3">
        <div className="flex items-center gap-2 text-gray-400">
          <User size={18} />
          <h3 className="text-xs font-black uppercase tracking-widest">Assigned To</h3>
        </div>
        <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-[20px] border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{item.responsiblePerson}</p>
          {item.responsibleEmail && (
            <p className="text-xs text-gray-400 mt-0.5">{item.responsibleEmail}</p>
          )}
        </div>
      </div>

      {/* Completion/Reason info if already filled */}
      {item.completionDescription && (
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2 text-gray-400">
            <AlignLeft size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">Completion Notes</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed bg-emerald-50 p-3 md:p-4 rounded-xl md:rounded-[20px] border border-emerald-100">
            {item.completionDescription}
          </p>
        </div>
      )}

      {item.unableToCompleteReason && (
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2 text-gray-400">
            <AlignLeft size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">Reason</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed bg-red-50 p-3 md:p-4 rounded-xl md:rounded-[20px] border border-red-100">
            {item.unableToCompleteReason}
          </p>
        </div>
      )}

      {item.remarks && (
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2 text-gray-400">
            <AlignLeft size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">Remarks</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-[20px] border border-gray-100">
            {item.remarks}
          </p>
        </div>
      )}

      {/* Status Update Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-bold text-gray-700">
            {formLabels[showForm].title}
          </h4>
          <textarea
            className="w-full p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px]"
            placeholder={formLabels[showForm].placeholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(null);
                setDescription("");
              }}
              className="flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm bg-gray-100 text-gray-600 active:scale-[0.98] hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleStatusUpdate(showForm)}
              disabled={isSubmitting}
              className="flex-1 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm bg-blue-600 text-white active:scale-[0.98] disabled:opacity-60 hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? "Updating..." : "Confirm"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Action buttons JSX - not wrapped in a function to prevent re-renders
  const actionButtonsJSX = (
    <>
      {!showForm && item.status !== "completed" && item.status !== "unable_to_complete" && (
        <div className="space-y-3">
          <button
            onClick={() => setShowForm("completed")}
            className="w-full py-3 md:py-4 rounded-xl md:rounded-[20px] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
          >
            <CheckCircle2 size={20} />
            Mark as Completed
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm("delayed")}
              className="flex-1 py-2.5 md:py-3 rounded-xl md:rounded-[20px] font-bold text-sm flex items-center justify-center gap-2 bg-amber-50 text-amber-600 border border-amber-100 active:scale-[0.98] hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle size={16} />
              Delay
            </button>
            <button
              onClick={() => setShowForm("unable_to_complete")}
              className="flex-1 py-2.5 md:py-3 rounded-xl md:rounded-[20px] font-bold text-sm flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-100 active:scale-[0.98] hover:bg-red-100 transition-colors"
            >
              <XCircle size={16} />
              Unable
            </button>
          </div>
        </div>
      )}

      {!showForm && (item.status === "completed" || item.status === "unable_to_complete") && (
        <div
          className={cn(
            "w-full py-3 md:py-4 rounded-xl md:rounded-[20px] font-black text-sm flex items-center justify-center gap-3",
            item.status === "completed"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-red-50 text-red-500 border border-red-100"
          )}
        >
          {item.status === "completed" ? (
            <>
              <CheckCircle2 size={20} />
              Task Completed
            </>
          ) : (
            <>
              <XCircle size={20} />
              Unable to Complete
            </>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile: Full screen overlay */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="md:hidden absolute inset-0 bg-white z-50 flex flex-col h-full"
      >
        {/* Header */}
        <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-gray-50 shrink-0">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm font-bold text-gray-400">Action Item Detail</span>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {contentJSX}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 pb-10 shrink-0">
          {actionButtonsJSX}
        </div>
      </motion.div>

      {/* Desktop: Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hidden md:flex fixed inset-0 bg-black/50 z-50 items-center justify-center p-4"
        onClick={onBack}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Action Item Detail</h2>
            <button
              onClick={onBack}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {contentJSX}
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
            {actionButtonsJSX}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};