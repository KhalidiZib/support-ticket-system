import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../../services/authService"; // This calls backend verify check
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    useEffect(() => {
        if (!email) {
            // If accessed directly without email state, technically fine, they just need the OTP from their inbox
        }
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }
        setLoading(true);

        try {
            // Just verify the token validity first
            await verifyOtp(otp);
            toast.success("Code verified!");
            // Proceed to Reset Password page, passing the valid OTP
            navigate("/reset-password", { state: { otp } });
        } catch (error) {
            toast.error("Invalid or expired code.");
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
                    <div className="w-16 h-16 bg-primary-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-3 3"></path><path d="M12 18v.01"></path><path d="M16 18v.01"></path><path d="M8 18v.01"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Verify Code</h1>
                    <p className="text-slate-500 mt-2">
                        We've sent a 6-digit code to {email ? <span className="text-primary-600 font-medium">{email}</span> : "your email"}.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 text-center">Authentication Code</label>
                        <input
                            type="text"
                            maxLength="6"
                            placeholder="000 000"
                            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-3xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-slate-800 placeholder:text-slate-300"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:shadow-primary-500/40 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify Identity"}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-500">Didn't receive code? <Link to="/forgot-password" className="text-primary-600 font-medium hover:underline">Resend</Link></p>
                </div>
            </div>
            <p className="mt-8 text-slate-400 text-sm relative z-10">© SupportHub System</p>
        </div>
    );
}
