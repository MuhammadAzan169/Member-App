import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

interface SignupScreenProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      // Demo-only: create a local user (no org/permission checks)
      await signup(email, password, name);
      toast.success("Account created successfully!");
      onSignup();
    } catch (err: any) {
      const message = String(err?.message || "");
      toast.error(message ? `Signup failed: ${message}` : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white md:bg-gray-50 flex flex-col md:rounded-[2rem] md:shadow-2xl md:border md:border-gray-200 overflow-hidden relative">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onSwitchToLogin}
        className="flex items-center gap-1 text-gray-500 mb-6 md:mb-8 self-start ml-6 md:ml-10 pt-10 md:pt-12"
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-semibold">Back to Login</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-10 px-6 md:px-10"
      >
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Create Account
        </h1>
        <p className="text-gray-400 mt-1 md:mt-2 font-medium text-sm md:text-base">
          Join MeetingSense Member Portal
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 md:px-10 pb-10"
      >
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm md:text-base"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm md:text-base"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm md:text-base"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm md:text-base"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 md:py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-60 text-sm md:text-base"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="text-blue-600 font-bold hover:text-blue-700">
              Login
            </button>
          </p>
        </div>
      </motion.div>

      {/* Decorative - Desktop only */}
      <div className="hidden md:block absolute top-0 right-0 -z-10 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="hidden md:block absolute bottom-0 left-0 -z-10 w-64 h-64 bg-indigo-50/50 rounded-full -ml-32 -mb-32 blur-3xl" />
    </div>
  );
};