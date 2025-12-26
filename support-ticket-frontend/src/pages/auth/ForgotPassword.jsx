import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../services/authService";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success("OTP sent to your email!");
      // Proceed to Verify OTP page, passing email to be helpful (optional)
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error("Failed to send OTP. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary-600 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-primary-600 to-indigo-800 opacity-90 z-0"></div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
          <p className="text-slate-500 mt-2">
            No worries! Enter your email and we'll send you a recovery code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Sending Code..." : "Send Recovery Code"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <Link to="/login" className="flex items-center justify-center text-sm font-medium text-secondary-500 hover:text-primary-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Sign In
          </Link>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-sm relative z-10">© SupportHub System</p>
    </div>
  );
}
