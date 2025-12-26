import React, { useState } from "react";
import { registerCustomer } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await registerCustomer(form);
      setMessage("Account created successfully! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side - Hero / Decor */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600 to-indigo-900 opacity-90 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

        <div className="relative z-20 text-center max-w-lg">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Join SupportHub</h2>
            <p className="text-primary-100 leading-relaxed">
              Create an account to start submitting tickets and tracking your support requests in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 p-2 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 font-medium text-sm group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">
              Get started with your free customer account
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-8">
            {/* MESSAGES */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 border border-red-100">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium flex items-center gap-2 border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  placeholder="John Doe"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  placeholder="+1234567890"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  placeholder="you@company.com"
                  required
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 pt-6 mt-2 border-t border-slate-100">
              Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
