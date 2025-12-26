import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { fetchTicketById, addCommentToTicket, assignTicket, updateTicketStatus } from "../../services/ticketService";
import { fetchUsers } from "../../services/userService";
import { formatDate, formatStatus } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

import toast from "react-hot-toast";

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  // State ...
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]); // List of available agents
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // ... same load logic
    const load = async () => {
      try {
        const [ticketData, agentsData] = await Promise.all([
          fetchTicketById(id),
          (user?.role === 'ADMIN') ? fetchUsers({ role: 'AGENT', size: 100 }) : Promise.resolve([])
        ]);

        setTicket(ticketData);
        setComments(ticketData.comments || []);

        const agentsList = Array.isArray(agentsData) ? agentsData : (agentsData?.content || []);
        setAgents(agentsList);
      } catch (e) {
        toast.error("Failed to load ticket details");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    console.log("TicketDetails User:", user);
    console.log("TicketDetails Agents:", agents);
  }, [user, agents]);

  const handleAssign = async (agentId) => {
    try {
      const updated = await assignTicket(ticket.id, agentId);
      setTicket(updated);
      toast.success("Agent assigned successfully!");
    } catch (err) {
      toast.error("Failed to assign agent.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateTicketStatus(ticket.id, newStatus);
      setTicket(updated);
      toast.success(`Status updated to ${newStatus}!`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const saved = await addCommentToTicket(id, newComment);
      setComments((prev) => [...prev, saved]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment.");
    }
  };

  if (loading) {
    return (
      <>
        <p>Loading ticket…</p>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <p className="text-red-600">Ticket not found.</p>
      </>
    );
  }

  return (
    <>


      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${ticket.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                ticket.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
              {formatStatus(ticket.status)}
            </span>
            <span className="text-slate-400 text-sm font-medium">#{ticket.id}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{ticket.title}</h1>
        </div>

        <div className="text-right mt-4 md:mt-0">
          <p className="text-sm text-slate-500">Created on</p>
          <p className="font-medium text-slate-900">{formatDate(ticket.createdAt)}</p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${user?.role === 'CUSTOMER' ? '' : 'lg:grid-cols-3'} gap-8`}>
        {/* LEFT COLUMN: TICKET INFO & DESCRIPTION */}
        <div className={`${user?.role === 'CUSTOMER' ? '' : 'lg:col-span-2'} space-y-6`}>
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Description
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p>{ticket.description}</p>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Activity & Comments
            </h2>

            <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto px-1 custom-scrollbar">
              {comments.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm">No comments yet. Be the first to reply.</p>
                </div>
              )}

              {comments.map((c) => (
                <div key={c.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0 border border-indigo-200">
                    {c.author?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-slate-900 text-sm">{c.author?.name}</p>
                        <p className="text-xs text-slate-400">{formatDate(c.createdAt)}</p>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 resize-none text-slate-700"
                placeholder="Type your reply here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="absolute bottom-3 right-3">
                <Button variant="primary" onClick={submitComment} size="sm">
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR DETAILS */}
        {user?.role !== 'CUSTOMER' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Ticket Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Ticket ID</p>
                  <p className="text-sm font-semibold text-slate-900">#{ticket.id}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Priority</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.priority === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-100' :
                    ticket.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                    {ticket.priority}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Category</p>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    {ticket.category?.name}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Customer</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">
                      {ticket.customer?.name?.charAt(0)}
                    </div>
                    {user?.role === 'ADMIN' || user?.role === 'AGENT' ? (
                      <Link to={`/users/${ticket.customer?.id}`} className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium">
                        {ticket.customer?.name}
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-700">{ticket.customer?.name}</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Location</p>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {ticket.location?.name || "N/A"}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Assigned Agent</p>
                  {ticket.assignedAgent ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold border border-primary-200">
                        {ticket.assignedAgent.name.charAt(0)}
                      </div>
                      {user?.role === 'ADMIN' || user?.role === 'AGENT' ? (
                        <Link to={`/users/${ticket.assignedAgent?.id}`} className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium">
                          {ticket.assignedAgent.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-slate-700">{ticket.assignedAgent.name}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Unassigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* ACTIONS CARD */}
            {(user?.role === 'ADMIN' || user?.role === 'AGENT') && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Actions
                  </h3>
                </div>

                <div className="p-5 space-y-6">
                  {user.role === 'ADMIN' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        Assign Agent
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 block p-2.5 outline-none transition-all appearance-none cursor-pointer hover:border-slate-300"
                          onChange={(e) => handleAssign(e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select agent...</option>
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                      Update Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          disabled={ticket.status === status}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border flex items-center justify-center gap-2 ${ticket.status === status
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 shadow-sm'
                            }`}
                        >
                          {ticket.status === status && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          )}
                          {formatStatus(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
