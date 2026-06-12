import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Phone, Sparkles, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = "login" }) => {
  const [tab, setTab] = useState<"login" | "signup">(initialTab);
  const { loginWithEmail, signUpWithEmail, signInWithGoogle, setStatus } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorBox, setErrorBox] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorBox("");
    try {
      if (tab === "login") {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          throw new Error("Full Name is required for registration");
        }
        await signUpWithEmail(email, password, name, phone);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorBox(err.message || "Authentication failed. Please verify details.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setActionLoading(true);
    setErrorBox("");
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorBox(err.message || "Google sign-in was closed or failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Layer backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-effect p-8 shadow-2xl border border-brand-purple-500/30 z-10"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-purple-400/10 blur-3xl pointer-events-none" />

          {/* Close Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-purple-400 animate-pulse" />
              <span className="font-display font-semibold tracking-wider text-sm text-brand-purple-200 uppercase">
                Academic Portal
              </span>
            </div>
            <button
              onClick={onClose}
              id="auth-modal-close"
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="font-display text-2xl font-bold mb-2 text-white">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            {tab === "login"
              ? "Access your academic solutions & track your ongoing assignment project timelines."
              : "Register to get custom project quotes, consult premium academic writers, and monitor tasks."}
          </p>

          {/* Tab Selector */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/5">
            <button
              onClick={() => { setTab("login"); setErrorBox(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === "login"
                  ? "bg-brand-purple-600 text-white shadow-md shadow-brand-purple-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Secure Sign In
            </button>
            <button
              onClick={() => { setTab("signup"); setErrorBox(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === "signup"
                  ? "bg-brand-purple-600 text-white shadow-md shadow-brand-purple-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Register Student
            </button>
          </div>

          {errorBox && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-200 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorBox}</span>
            </div>
          )}

          {/* Auth form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Abhinandan Jain"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9530473222"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Secure Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-purple-800 hover:from-brand-purple-500 hover:to-brand-purple-700 text-white rounded-xl py-2.5 text-sm font-semibold shadow-lg shadow-brand-purple-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {actionLoading ? "Processing Encryption..." : tab === "login" ? "Enter Secure Portal" : "Join Consultancy Platform"}
            </button>
          </form>

          {/* Separator */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider font-semibold">Or Authenticate With</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Google Sign-in buttons */}
          <button
            onClick={handleGoogleAuth}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-98 shadow-md"
          >
            {/* Simple colored SVG Google Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.56 14.96 1 12 1 7.35 1 3.42 3.66 1.5 7.5l3.86 3C6.27 7.5 8.91 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.27c0-.82-.07-1.61-.2-2.38H12v4.51h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.94 3.73-8.58z"
              />
              <path
                fill="#FBBC05"
                d="M5.36 10.5c-.24-.72-.36-1.5-.36-2.3 0-.8.12-1.58.36-2.3L1.5 2.9C.54 4.8 0 7.11 0 9.5s.54 4.7 1.5 6.6l3.86-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.96-1.08 7.95-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.25 1.1-3.09 0-5.73-2.46-6.66-5.46l-3.86 3C3.42 20.34 7.35 23 12 23z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-gray-500 mt-6">
            Protected by standard AES-256 enterprise encryption protocols. By logging in, you verify your academic adherence to our professional guidance model.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
