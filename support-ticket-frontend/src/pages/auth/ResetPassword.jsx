import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset } from "../../services/authService";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const otp = location.state?.otp;

  useEffect(() => {
    if (!otp) {
      toast.error("No valid OTP found. Please start over.");
      navigate("/forgot-password");
    }
  }, [otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(otp, password);
      toast.success("Password reset successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to reset password. Code may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!otp) return null; // Prevent flash

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary-600 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-primary-600 to-indigo-800 opacity-90 z-0"></div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 text-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-3 3"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-slate-500 mt-2">
            Secure your account with a strong new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting Password..." : "Set New Password"}
          </button>
        </form>
      </div>
      <p className="mt-8 text-slate-400 text-sm relative z-10">© SupportHub System</p>
    </div>
  );
}
