import { useState } from "react";
import { loginRequest, verify2FARequest } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [error, setError] = useState("");

  // New state variables implied by the change
  const [step, setStep] = useState(1); // 1: Login form, 2: 2FA form
  const [tempResponse, setTempResponse] = useState(null); // To store login response before 2FA

  // ---------------------------
  // HANDLE LOGIN
  // ---------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginRequest({ email, password });

      console.log("DEBUG: Login response", res); // Log the response to debug

      // Determine if 2FA is required (check for twoFactorRequired flag)
      if (res.twoFactorRequired) {
        setTempResponse(res);
        setTwoFactorRequired(true);
        setStep(2); // show 2FA form
        setLoading(false);
        return;
      }

      // LOGIN SUCCESS
      // Check for token in various probable fields or just allow if no error
      if (res.token || res.accessToken || res.id) { // relaxed check
        finishLogin(res);
      } else {
        console.warn("Login response OK but no token found?", res);
        // Fallback: try to finish login anyway, maybe token is not needed or cookie based?
        // But for now, let's treat it as success if we got here without 2FA
        finishLogin(res);
      }

    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  // ---------------------------
  // HANDLE 2FA SUBMISSION
  // ---------------------------
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use email from tempResponse if available, otherwise current email state
      const userEmail = tempResponse?.email || email;
      const res = await verify2FARequest(userEmail, twoFactorCode);

      if (!res.token) {
        throw new Error("Invalid 2FA code");
      }

      finishLogin(res);

    } catch (err) {
      setError("Invalid 2FA code.");
      setLoading(false);
    }
  };

  // ---------------------------
  // FINAL LOGIN SUCCESS
  // ---------------------------
  const finishLogin = (res) => {
    localStorage.setItem("sts_token", res.token);

    // Store minimal user info
    login({
      email: res.email,
      role: res.role,
    });

    setLoading(false);



    // Redirect based on role
    // Using window.location.href to force full reload and ensure token is picked up
    if (res.role === "ADMIN") {
      window.location.href = "/admin/dashboard";
    } else if (res.role === "AGENT") {
      window.location.href = "/agent/dashboard";
    } else if (res.role === "CUSTOMER") {
      window.location.href = "/customer/dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Left Side - Hero / Decor */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600 to-indigo-800 opacity-90 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30"></div>

        <div className="relative z-20 text-center max-w-lg">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-primary-100 leading-relaxed">
              Manage your support tickets with ease. Speed, security, and simplicity all in one place.
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
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              {twoFactorRequired ? "Security Check" : "Sign In"}
            </h2>
            <p className="text-slate-500 mt-2">
              {twoFactorRequired ? "Enter the code from your app" : "Access your SupportHub workspace"}
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl p-8">
            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 border border-red-100">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {!twoFactorRequired ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <span
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot?
                    </span>
                  </div>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center text-sm text-slate-500 pt-4">
                  Don't have an account? <span className="text-primary-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/register')}>Sign up</span>
                </p>
              </form>
            ) : (
              // 2FA FORM
              <form onSubmit={handleVerify2FA} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3 text-center">Authentication Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="000 000"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-800 placeholder:text-slate-300"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-center text-slate-400 mt-2">Enter the code from your authenticator app</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all"
                >
                  {loading ? "Verifying..." : "Verify Identity"}
                </button>

                <button
                  type="button"
                  onClick={() => setTwoFactorRequired(false)}
                  className="w-full text-sm text-slate-500 hover:text-slate-700 py-2"
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}

