import React from "react";
import { CheckCircle2, Circle, Clock, Tag, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { cn, formatDate, isOverdue, relativeTime } from "../../lib/utils";
import type { ActionItem } from "../../types";

interface ActionItemCardProps {
  item: ActionItem;
  onClick: (item: ActionItem) => void;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const statusConfig: Record<string, { icon: React.ReactNode; color: string; dotColor: string }> = {
  pending: {
    icon: <Circle size={22} />,
    color: "text-gray-300 hover:text-blue-500 hover:bg-blue-50",
    dotColor: "bg-amber-500",
  },
  completed: {
    icon: <CheckCircle2 size={22} />,
    color: "text-emerald-500 bg-emerald-50",
    dotColor: "bg-emerald-500",
  },
  delayed: {
    icon: <AlertTriangle size={22} />,
    color: "text-amber-500 bg-amber-50",
    dotColor: "bg-amber-500",
  },
  unable_to_complete: {
    icon: <XCircle size={22} />,
    color: "text-red-500 bg-red-50",
    dotColor: "bg-red-500",
  },
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  delayed: "Delayed",
  unable_to_complete: "Unable",
};

export const ActionItemCard: React.FC<ActionItemCardProps> = ({ item, onClick }) => {
  const isComplete = item.status === "completed";
  const overdue = isOverdue(item.deadline, item.status);
  const config = statusConfig[item.status] || statusConfig.pending;
  const priority = item.priority || "medium";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onClick(item)}
      className={cn(
        "bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 transition-all cursor-pointer active:scale-[0.98]",
        isComplete && "opacity-60",
        overdue && "border-red-200 bg-red-50/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Top tags row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {item.meetingTitle && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1 truncate max-w-[140px]">
                <Tag size={10} />
                {item.meetingTitle}
              </span>
            )}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full border capitalize",
                priorityColors[priority]
              )}
            >
              {priority}
            </span>
            {overdue && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                Overdue
              </span>
            )}
          </div>

          {/* Task title */}
          <h3
            className={cn(
              "text-sm font-semibold text-gray-900 leading-tight mb-2",
              isComplete && "line-through text-gray-500"
            )}
          >
            {item.task}
          </h3>

          {/* Bottom info row */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span className={cn(overdue && "text-red-500 font-semibold")}>
                {formatDate(item.deadline)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
              <span>{statusLabels[item.status] || item.status}</span>
            </div>
            {item.deadline && (
              <span className="text-gray-400 text-[10px]">
                {relativeTime(item.deadline)}
              </span>
            )}
          </div>
        </div>

        {/* Status icon */}
        <div className={cn("mt-1 p-1 transition-colors rounded-full", config.color)}>
          {config.icon}
        </div>
      </div>
    </motion.div>
  );
};
