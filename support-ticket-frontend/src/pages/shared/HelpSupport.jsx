import React from "react";
import Layout from "../../components/layout/Layout";
import { Mail, Phone, HelpCircle, MessageCircle } from "lucide-react";

export default function HelpSupport() {
    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <HelpCircle className="text-blue-600" size={32} />
                    Help & Support
                </h1>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Main Contact Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Support</h2>
                        <p className="text-gray-600 mb-6">
                            Need assistance? Our support team is here to help. Reach out to us via email or phone.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Email Support</p>
                                    <a href="mailto:kzibika@gmail.com" className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                                        kzibika@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Phone Support</p>
                                    <a href="tel:+250781789132" className="text-lg font-semibold text-gray-800 hover:text-green-600">
                                        +250 781 789 132
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ / Info Cards */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                            <MessageCircle size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-600">
                            Live chat is currently unavailable. Please use email for urgent inquiries.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                            <HelpCircle size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Knowledge Base</h3>
                        <p className="text-sm text-gray-600">
                            Check our upcoming Wiki for tutorials and common troubleshooting steps.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
