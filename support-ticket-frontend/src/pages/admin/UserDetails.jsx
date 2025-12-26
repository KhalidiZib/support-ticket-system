import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { fetchUserById, deleteUser, toggleUserEnabled } from "../../services/userService";
import { formatRole, formatDate } from "../../utils/formatters";
import { User, Mail, Phone, Shield, Trash2, ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchUserById(id);
                setUser(data);
            } catch (error) {
                toast.error("Failed to load user details");
                navigate("/admin/users");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, navigate]);

    const handleDelete = async () => {
        console.log("DEBUG: Delete button clicked");
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            console.log("DEBUG: Delete cancelled");
            return;
        }

        console.log("DEBUG: Delete confirmed, proceeding...");
        try {
            await deleteUser(id);
            console.log("DEBUG: Delete success");
            toast.success("User deleted successfully");
            navigate("/admin/agents");
        } catch (error) {
            console.error("DEBUG: Delete failed", error);
            toast.error("Failed to delete user");
        }
    };

    const handleToggleStatus = async () => {
        try {
            const updatedUser = await toggleUserEnabled(id);
            setUser(updatedUser);
            toast.success(`User ${updatedUser.enabled ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to List
                </button>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900 relative">
                    <div className="absolute inset-0 bg-white/5 pattern-grid"></div>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-8">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-400 shadow-md">
                            <User size={40} />
                        </div>



                        <div className="flex gap-2 relative z-10">
                            {currentUser?.role === 'ADMIN' && (
                                <>
                                    <Button
                                        variant={user.enabled ? "warning" : "success"}
                                        onClick={handleToggleStatus}
                                        icon={<Shield size={18} />}
                                    >
                                        {user.enabled ? "Disable User" : "Enable User"}
                                    </Button>

                                    <Button
                                        variant="danger"
                                        onClick={handleDelete}
                                        icon={<Trash2 size={18} />}
                                    >
                                        Delete User
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                            user.role === 'AGENT' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            {formatRole(user.role)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-1">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 ml-7">{user.email}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-1">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 ml-7">{user.phoneNumber || "Not Set"}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-1">
                                <Shield size={16} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Account Status</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 ml-7">
                                {user.enabled ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                    </span>
                                ) : (
                                    <span className="text-red-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Disabled
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
