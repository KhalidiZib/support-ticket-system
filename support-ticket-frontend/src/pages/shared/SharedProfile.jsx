import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { getMyProfile, updateMyProfile, uploadAvatar } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Phone, Camera, Save, X } from "lucide-react";
import Button from "../../components/ui/Button";

export default function SharedProfile() {
    const { user: authUser, login, updateUser } = useAuth(); // We might need to update auth context? 
    // Actually AuthContext usually decodes token. If we update server, token might be stale for name, 
    // but we can just update local display. Ideally we refresh token but for now let's just fetch fresh data here.

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: ""
    });

    const fetchProfile = async () => {
        try {
            const data = await getMyProfile();
            setProfile(data);
            setFormData({
                name: data.name,
                phoneNumber: data.phoneNumber || ""
            });
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = await updateMyProfile(formData);
            setProfile(updated);
            updateUser({ name: updated.name, phoneNumber: updated.phoneNumber }); // Update global state
            setEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simple validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        try {
            const updated = await uploadAvatar(file);
            setProfile(updated);
            updateUser({ avatarUrl: updated.avatarUrl }); // Update global state
            toast.success("Avatar updated!");
            // Optionally trigger a global auth status refresh if context relies on it
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload avatar");
        }
    };

    if (loading) return <>Loading...</>;

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">My Profile</h1>

                <div className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
                    {/* Header / Banner */}
                    <div className="h-40 bg-gradient-to-r from-primary-600 to-indigo-800 relative">
                        <div className="absolute inset-0 bg-white/10 opacity-30 pattern-grid"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-14 mb-8">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 overflow-hidden flex items-center justify-center shadow-md">
                                    {profile?.avatarUrl ? (
                                        <img src={`http://localhost:8085/support-api${profile.avatarUrl}`} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} className="text-slate-300" />
                                    )}
                                </div>

                                {/* Upload overlay */}
                                <label className="absolute inset-0 bg-secondary-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer text-white backdrop-blur-[2px]">
                                    <Camera size={24} className="drop-shadow-md" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>

                            {!editing && (
                                <Button onClick={() => setEditing(true)} className="mb-2 shadow-sm">Edit Profile</Button>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleUpdate} className="space-y-5 max-w-lg animate-fade-in">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" icon={<Save size={18} />}>Save Changes</Button>
                                    <Button variant="secondary" onClick={() => setEditing(false)} icon={<X size={18} />}>Cancel</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                        {profile?.name}
                                        <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                            #{profile?.id}
                                        </span>
                                    </h2>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 mt-2 border border-primary-100">
                                        {profile?.role}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-100 transition-colors">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm border border-slate-100">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</p>
                                            <p className="text-sm font-medium text-slate-900 mt-0.5">{profile?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-100 transition-colors">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm border border-slate-100">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</p>
                                            <p className="text-sm font-medium text-slate-900 mt-0.5">{profile?.phoneNumber || "Not set"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Security Section (2FA) */}
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-2xl shadow-card border border-secondary-100 p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Security Settings</h2>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                            <h3 className="font-semibold text-slate-800">Two-Factor Authentication (2FA)</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Secure your account with Google Authenticator.
                            </p>
                        </div>
                        <TwoFactorToggle />
                    </div>
                </div>
            </div>
        </>
    );
}

function TwoFactorToggle() {
    const [status, setStatus] = useState(null); // { enabled: bool, message: str }
    const [qrData, setQrData] = useState(null); // { qrCodeBase64: str, secret: str, otpAuthUrl: str }
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const s = await import("../../services/authService").then(m => m.get2faStatus());
            setStatus(s);
        } catch (e) {
            console.error(e);
        }
    };

    const handleEnable = async () => {
        try {
            const data = await import("../../services/authService").then(m => m.enableTwoFactor());
            setQrData(data);
            setShowModal(true);
            loadStatus(); // refresh status (it might say enabled now)
        } catch (e) {
            toast.error("Failed to enable 2FA");
        }
    };

    const handleDisable = async () => {
        if (!window.confirm("Are you sure you want to disable 2FA?")) return;
        try {
            await import("../../services/authService").then(m => m.disableTwoFactor());
            toast.success("2FA Disabled");
            setQrData(null);
            loadStatus();
        } catch (e) {
            toast.error("Failed to disable 2FA");
        }
    };

    if (!status) return <div className="text-sm text-slate-400">Loading...</div>;

    return (
        <>
            {status.enabled ? (
                <Button variant="danger" onClick={handleDisable}>Disable 2FA</Button>
            ) : (
                <Button onClick={handleEnable}>Enable 2FA</Button>
            )}

            {/* QR Logic Modal (Simple inline for now) */}
            {showModal && qrData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold mb-3 text-slate-800">Setup Authenticator</h3>
                        <p className="text-sm text-slate-600 mb-5">
                            Scan this QR code with your Google Authenticator app, then enter the code below to activate.
                        </p>

                        <div className="flex justify-center mb-5 bg-white p-2 rounded-xl border border-slate-100 shadow-sm w-fit mx-auto">
                            <img src={`data:image/png;base64,${qrData.qrCodeBase64}`} alt="QR Code" className="w-40 h-40 rounded-lg" />
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-5 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">Secret Key</p>
                            <code className="text-sm font-mono font-bold text-slate-800 tracking-wider block selection:bg-primary-100">{qrData.secret}</code>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
                            <input
                                type="text"
                                placeholder="000 000"
                                maxLength="6"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-center tracking-[0.5em] font-mono text-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                id="2fa-input"
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && e.target.value.length === 6) {
                                        const btn = document.getElementById('activate-btn');
                                        if (btn) btn.click();
                                    }
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                id="activate-btn"
                                className="w-full justify-center py-2.5"
                                onClick={async () => {
                                    const input = document.getElementById('2fa-input');
                                    const code = input?.value;
                                    if (!code || code.length < 6) {
                                        toast.error("Please enter the 6-digit code");
                                        return;
                                    }
                                    try {
                                        await import("../../services/authService").then(m => m.confirmEnableTwoFactor(code));
                                        toast.success("2FA Activated Successfully!");
                                        setShowModal(false);
                                        loadStatus();
                                    } catch (err) {
                                        toast.error("Invalid Code. Try again.");
                                    }
                                }}
                            >
                                Verify & Activate
                            </Button>
                            <Button className="w-full justify-center" onClick={() => setShowModal(false)} variant="ghost">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
