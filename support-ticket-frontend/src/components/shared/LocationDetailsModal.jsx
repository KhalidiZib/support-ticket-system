import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LocationDetailsModal({ location, onClose }) {
    const navigate = useNavigate();

    if (!location) return null;

    const handleViewTickets = () => {
        navigate(`/admin/tickets?locationId=${location.id}`);
        onClose();
    };

    return (
        <Modal
            isOpen={!!location}
            onClose={onClose}
            title="Location Details"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} size="sm">
                        Close
                    </Button>
                    <Button onClick={handleViewTickets} size="sm">
                        View Tickets Here
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Hierarchy Breadcrumbs */}
                {location.ancestors && location.ancestors.length > 0 && (
                    <div className="flex flex-wrap items-center text-sm text-slate-500 mb-2">
                        {location.ancestors.map((ancestor) => (
                            <React.Fragment key={ancestor.id}>
                                <span className="font-medium hover:text-slate-800 transition-colors">
                                    {ancestor.name}
                                </span>
                                <ChevronRight size={14} className="mx-1 text-slate-400" />
                            </React.Fragment>
                        ))}
                        <span className="font-bold text-slate-900">{location.name}</span>
                    </div>
                )}

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm shrink-0">
                        <MapPin className="text-primary-600" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{location.name}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 mt-1">
                            {location.type}
                        </span>
                    </div>
                </div>

                <p className="text-sm text-slate-600">
                    This location is part of the <strong>{location?.ancestors?.[0]?.name || "Rwanda"}</strong> region.
                    Clicking "View Tickets Here" will filter the ticket list to show only issues reported within <strong>{location.name}</strong>.
                </p>
            </div>
        </Modal>
    );
}
