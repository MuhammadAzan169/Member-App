import React, { useEffect, useState } from "react";
import { Building2, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { discoverOrganizations } from "../../services/api";
import type { Organization } from "../../types";

interface OrgSelectScreenProps {
  onSelect: (org: Organization) => void;
}

export const OrgSelectScreen: React.FC<OrgSelectScreenProps> = ({ onSelect }) => {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!user?.email) return;
      setLoading(true);
      setError("");
      try {
        const found = await discoverOrganizations(user.email);
        setOrgs(found);

        // Auto-select if only one org
        if (found.length === 1) {
          onSelect(found[0]);
          return;
        }

        if (found.length === 0) {
          setError("No organizations found for your email. Please contact your admin.");
        }
      } catch {
        setError("Failed to load organizations. Please try again.");
        toast.error("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center bg-white md:bg-gray-50 md:rounded-[2rem] md:shadow-2xl md:border md:border-gray-200 px-8">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Finding your organizations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[300px] md:min-h-[400px] bg-white md:bg-gray-50 flex flex-col md:rounded-[2rem] md:shadow-2xl md:border md:border-gray-200 overflow-hidden relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-10 pt-12 md:pt-14 px-6 md:px-10"
      >
        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
          <Building2 className="text-blue-600" size={24} />
        </div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          Select Organization
        </h1>
        <p className="text-gray-400 mt-1 md:mt-2 font-medium text-sm md:text-base">
          Choose which organization's tasks to view
        </p>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 md:p-5 bg-red-50 rounded-2xl border border-red-100 mx-6 md:mx-10 mb-6"
        >
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-700 font-semibold text-sm">{error}</p>
            <p className="text-red-500 text-xs mt-1">
              Make sure your admin has added your email to their members list.
            </p>
          </div>
        </motion.div>
      )}

      {/* Organization List - Grid on Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-6 md:px-10 pb-10"
      >
        {orgs.map((org, idx) => (
          <motion.button
            key={org.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * idx }}
            onClick={() => {
              toast.success(`Switched to ${org.name}`);
              onSelect(org);
            }}
            className="w-full flex items-center justify-between p-4 md:p-5 bg-gray-50 hover:bg-blue-50 rounded-2xl transition-all group active:scale-[0.98] border border-transparent hover:border-blue-100"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base md:text-lg shadow-lg shadow-blue-100">
                {org.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-sm md:text-base">{org.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{org.adminEmail}</p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-gray-300 group-hover:text-blue-500 transition-colors"
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Decorative - Desktop only */}
      <div className="hidden md:block absolute top-0 right-0 -z-10 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="hidden md:block absolute bottom-0 left-0 -z-10 w-64 h-64 bg-indigo-50/50 rounded-full -ml-32 -mb-32 blur-3xl" />
    </div>
  );
};