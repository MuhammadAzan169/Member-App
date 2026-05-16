import React, { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { OrgSelectScreen } from "./components/OrgSelectScreen";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import type { Organization, Page } from "../types";

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [page, setPage] = useState<Page>("login");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-100 mb-6 animate-pulse">
          M
        </div>
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white md:bg-gray-100 flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {page === "signup" ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SignupScreen
                  onSignup={() => setPage("org-select")}
                  onSwitchToLogin={() => setPage("login")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <LoginScreen
                  onLogin={() => setPage("org-select")}
                  onSwitchToSignup={() => setPage("signup")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Authenticated but no org selected → org selection
  if (!selectedOrg) {
    return (
      <div className="min-h-screen bg-white md:bg-gray-100 flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-lg">
          <motion.div
            key="org-select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <OrgSelectScreen
              onSelect={(org) => setSelectedOrg(org)}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated + org selected → Dashboard
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100"
    >
      <Dashboard
        organization={selectedOrg}
        onSwitchOrg={() => setSelectedOrg(null)}
        onLogout={async () => {
          await logout();
          setSelectedOrg(null);
          setPage("login");
        }}
      />
    </motion.div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster position="top-center" expand={false} richColors />
      <AppContent />
    </AuthProvider>
  );
};

export default App;