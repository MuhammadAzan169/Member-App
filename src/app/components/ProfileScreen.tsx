import React from "react";
import {
  User,
  Building2,
  LogOut,
  ChevronRight,
  Mail,
  CheckCircle2,
  Clock,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import type { Organization } from "../../types";

interface ProfileScreenProps {
  organization: Organization;
  onSwitchOrg: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  organization,
  onSwitchOrg,
  onLogout,
}) => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: "Switch Organization",
      subtitle: organization.name,
      icon: <ArrowLeftRight size={20} />,
      color: "text-blue-600",
      onClick: onSwitchOrg,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FAFBFF]">
      {/* Header / Cover - Mobile */}
      <div className="md:hidden relative h-44 bg-gradient-to-br from-blue-600 to-indigo-700 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
        <div className="absolute -bottom-14 left-6 flex items-end gap-4">
          <div className="w-20 h-20 rounded-[22px] bg-white p-1.5 shadow-xl">
            <div className="w-full h-full rounded-[18px] bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-black text-blue-600">
                {user?.displayName?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </span>
            </div>
          </div>
          <div className="mb-2">
            <h2 className="text-lg font-black text-gray-900 leading-none">
              {user?.displayName || "Member"}
            </h2>
            <p className="text-gray-500 font-medium text-xs mt-1 flex items-center gap-1">
              <Building2 size={10} />
              {organization.name}
            </p>
          </div>
        </div>
      </div>

      {/* Header - Desktop */}
      <div className="hidden md:block bg-white border-b border-gray-100 shrink-0">
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-black text-gray-900">Profile</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your account settings</p>
        </div>
      </div>

      {/* Content - Mobile */}
      <div className="md:hidden flex-1 overflow-y-auto px-6 pt-18 pb-28 space-y-6">
        {/* User Info Cards */}
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Email
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
              <User size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Role
              </div>
              <div className="text-sm font-semibold text-gray-900">
                Member
              </div>
            </div>
          </div>
        </div>

        {/* Member Badge */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-5 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
          <Sparkles className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 rotate-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                MeetingSense
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">Team Member</h3>
            <p className="text-sm text-white/70">
              Stay on top of your action items and help your team succeed.
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
            Settings
          </h4>
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            {menuItems.map((item, idx) => (
              <button
                key={item.title}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  idx !== menuItems.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-gray-700 text-sm">{item.title}</span>
                    {item.subtitle && (
                      <p className="text-[10px] text-gray-400">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-4 bg-red-50 text-red-600 font-black rounded-[20px] border border-red-100 flex items-center justify-center gap-3 hover:bg-red-100 transition-colors active:scale-[0.98]"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>

      {/* Content - Desktop */}
      <div className="hidden md:flex flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Avatar Section */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 pt-8 pb-16 px-6 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="w-24 h-24 rounded-[28px] bg-white p-1.5 shadow-xl">
                      <div className="w-full h-full rounded-[22px] bg-blue-100 flex items-center justify-center">
                        <span className="text-3xl font-black text-blue-600">
                          {user?.displayName?.charAt(0).toUpperCase() ||
                            user?.email?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-12 pb-6 px-6 text-center">
                  <h2 className="text-xl font-black text-gray-900">
                    {user?.displayName || "Member"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-gray-500 text-sm">
                    <Building2 size={14} />
                    <span>{organization.name}</span>
                  </div>
                </div>
              </div>

              {/* Member Badge */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-5 text-white shadow-xl shadow-blue-100 relative overflow-hidden mt-6">
                <Sparkles className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 rotate-12" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-amber-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                      MeetingSense
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">Team Member</h3>
                  <p className="text-sm text-white/70">
                    Stay on top of your action items and help your team succeed.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Info */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Account Information</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  <div className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        Email
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
                      <User size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        Role
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        Member
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Settings</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {menuItems.map((item) => (
                    <button
                      key={item.title}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${item.color}`}>
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-gray-700 text-sm">{item.title}</span>
                          {item.subtitle && (
                            <p className="text-xs text-gray-400">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 flex items-center justify-center gap-3 hover:bg-red-100 transition-colors active:scale-[0.99]"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};