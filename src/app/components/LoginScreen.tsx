import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      onLogin();
    } catch (err: any) {
      void err;
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Failed to send reset email");
    }
  };

  return (
    <div className="min-h-full bg-white md:bg-gray-50 flex flex-col md:rounded-[2rem] md:shadow-2xl md:border md:border-gray-200 overflow-hidden relative">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-8 md:mb-12 pt-12 md:pt-16"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-[20px] md:rounded-[24px] flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-2xl shadow-blue-100 mb-4 md:mb-6 rotate-3">
          M
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          MeetingSense
        </h1>
        <p className="text-gray-400 mt-1 md:mt-2 font-medium text-sm md:text-base">Member Portal</p>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 md:px-10 pb-10"
      >
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
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
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3.5 md:py-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm md:text-base"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 md:py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-60 text-sm md:text-base"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Login
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 md:mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{" "}
            <button onClick={onSwitchToSignup} className="text-blue-600 font-bold hover:text-blue-700">
              Sign Up
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