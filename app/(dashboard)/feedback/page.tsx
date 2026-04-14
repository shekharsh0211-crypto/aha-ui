'use client';
import { useState } from 'react';
import { MessageSquare, Plus, Send, X, ChevronRight } from 'lucide-react';
import { useFeedbacks, useFeedback, useCreateFeedback, useReplyFeedback, useCloseFeedback } from '@/hooks/useFeedback';
import { TicketStatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Feedback, TicketStatus } from '@/types';

const STATUS_TABS: { label: string; value: TicketStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Closed', value: 'CLOSED' },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState<TicketStatus | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  const { data: feedbacksPage, isLoading } = useFeedbacks(activeStatus);
  const { data: selected } = useFeedback(selectedId);
  const createFeedback = useCreateFeedback();
  const replyFeedback = useReplyFeedback();
  const closeFeedback = useCloseFeedback();

  const feedbacks: Feedback[] = feedbacksPage?.content ?? [];

  const [newForm, setNewForm] = useState({ subject: '', message: '', bookingReference: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFeedback.mutateAsync({ subject: newForm.subject, message: newForm.message });
    setShowNewModal(false);
    setNewForm({ subject: '', message: '', bookingReference: '' });
  };

  const handleReply = async () => {
    if (!selectedId || !replyText.trim()) return;
    await replyFeedback.mutateAsync({ id: selectedId, message: replyText });
    setReplyText('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Support &amp; Feedback</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-600/30"
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveStatus(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeStatus === tab.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Ticket list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <MessageSquare size={36} className="mb-2 opacity-25" />
              <p className="text-sm">No tickets found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {feedbacks.map((fb) => (
                <button
                  key={fb.id}
                  onClick={() => setSelectedId(fb.id)}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${
                    selectedId === fb.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate flex-1">{fb.subject}</p>
                    <ChevronRight size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <TicketStatusBadge status={fb.ticketStatus} />
                    <span className="text-xs text-gray-400">{formatDate(fb.createdAt)}</span>
                  </div>
                  {fb.message && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{fb.message}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ticket detail */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
              <MessageSquare size={40} className="mb-3 opacity-25" />
              <p className="text-sm">Select a ticket to view details</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Ticket header */}
              <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-100">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selected.subject}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <TicketStatusBadge status={selected.ticketStatus} />
                    <span className="text-xs text-gray-400">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>
                {selected.ticketStatus !== 'CLOSED' && (
                  <button
                    onClick={() => closeFeedback.mutate(selected.id)}
                    className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
                  >
                    <X size={12} />
                    Close
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
                {/* Original message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {selected.userFullName?.[0] ?? 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-50 rounded-2xl rounded-tl-none px-4 py-3">
                      <p className="text-sm text-gray-800">{selected.message}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-1">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                {/* Replies */}
                {selected.replies?.map((reply) => {
                  const isMe = reply.userId === user?.id;
                  return (
                    <div key={reply.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isMe ? 'bg-green-600' : 'bg-gray-500'}`}>
                        {reply.userFullName?.[0] ?? 'S'}
                      </div>
                      <div className={`flex-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`rounded-2xl px-4 py-3 max-w-xs ${isMe ? 'bg-green-50 rounded-tr-none' : 'bg-gray-100 rounded-tl-none'}`}>
                          <p className="text-sm text-gray-800">{reply.message}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 mx-1">{formatDate(reply.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply input */}
              {selected.ticketStatus !== 'CLOSED' && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-end gap-2">
                    <textarea
                      rows={2}
                      placeholder="Type your reply…"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleReply();
                        }
                      }}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || replyFeedback.isPending}
                      className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex-shrink-0"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">New Support Ticket</h3>
              <button onClick={() => setShowNewModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Brief description of your issue"
                  value={newForm.subject}
                  onChange={(e) => setNewForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue in detail…"
                  value={newForm.message}
                  onChange={(e) => setNewForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFeedback.isPending}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl transition-colors"
                >
                  {createFeedback.isPending ? 'Submitting…' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
