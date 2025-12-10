import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  User,
  MessageSquare,
  Send,
  Reply,
  Eye,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminAPI } from '@/services/adminAPI';
import { motion } from 'framer-motion';

export default function AdminSupport({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await adminAPI.getSupportTickets();
      setTickets(response.data?.tickets || []);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      setTickets([]);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getSupportStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      await adminAPI.updateTicketStatus(ticketId, status);
      toast.success('Ticket status updated');
      fetchTickets();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  const addReply = async (ticketId) => {
    if (!replyText.trim()) return;
    
    setReplyLoading(true);
    try {
      await adminAPI.addTicketReply(ticketId, replyText);
      toast.success('Reply added successfully');
      setReplyText('');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to add reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">High</Badge>;
      case 'urgent':
        return <Badge className="bg-red-600/10 text-red-600 border-red-600/20">Urgent</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-20 pointer-events-none opacity-60">
          <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[160px] rounded-full -top-40 -left-20 animate-pulse-slow"></div>
          <div className="absolute w-[600px] h-[600px] bg-blue-600/40 blur-[190px] rounded-full bottom-10 right-0 animate-pulse-slower"></div>
        </div>

        <AdminSidebar onLogout={handleLogout} />

        <div className="pl-80 p-6">
          <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="spinner mb-4"></div>
              <p className="text-white/70">Loading support tickets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-60">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[160px] rounded-full -top-40 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-600/40 blur-[190px] rounded-full bottom-10 right-0 animate-pulse-slower"></div>
      </div>

      <AdminSidebar onLogout={handleLogout} />

      <div className="p-6">
        <div className="max-w-7xl mx-auto ml-80">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                <FileText size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  Support{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Center
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-xl mt-2">
                  Manage support tickets and customer inquiries
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_tickets}</p>
                      <p className="text-sm text-muted-foreground">Total Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.open_tickets}</p>
                      <p className="text-sm text-muted-foreground">Open Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.resolved_tickets}</p>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.avg_resolution_time}h</p>
                      <p className="text-sm text-muted-foreground">Avg Resolution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex gap-4 flex-wrap items-center">
                  <div className="flex items-center gap-2 flex-1 min-w-64">
                    <Search size={20} className="text-muted-foreground" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-white/20 bg-white/5"
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tickets List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Support Tickets</h2>
              <Badge className="bg-white/10 text-foreground border-white/20">
                {filteredTickets.length} Tickets
              </Badge>
            </div>

            {filteredTickets.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg text-foreground font-medium">No tickets found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'No support tickets yet'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket, index) => (
                  <Card key={ticket.id} className="glass-card hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <User size={18} className="text-blue-400" />
                            <CardTitle className="text-lg text-foreground">{ticket.subject}</CardTitle>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="text-muted-foreground mb-2">{ticket.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>From: {ticket.user}</span>
                            <span>{formatDate(ticket.created_at)}</span>
                            <div className="flex items-center gap-1">
                              <MessageSquare size={16} />
                              <span>{ticket.replies || 0} replies</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedTicket(ticket)}
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-foreground hover:bg-white/5"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          {ticket.status !== 'closed' && (
                            <>
                              {ticket.status === 'open' && (
                                <Button
                                  onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                                  size="sm"
                                  className="bg-yellow-500 hover:bg-yellow-600"
                                >
                                  Start
                                </Button>
                              )}
                              {ticket.status === 'in_progress' && (
                                <Button
                                  onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Resolve
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>

          {/* Ticket Detail Modal */}
          {selectedTicket && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTicket(null)}
            >
              <Card
                className="glass-card max-w-2xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-foreground">{selectedTicket.subject}</CardTitle>
                      <CardDescription>From {selectedTicket.user} • {formatDate(selectedTicket.created_at)}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(selectedTicket.status)}
                      {getPriorityBadge(selectedTicket.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedTicket.description}</p>
                  </div>
                  
                  {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Replies</h4>
                      <div className="space-y-3">
                        {selectedTicket.replies.map((reply, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <User size={16} className="text-muted-foreground" />
                              <span className="font-medium text-foreground">{reply.author}</span>
                              <span className="text-sm text-muted-foreground">{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="text-muted-foreground">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Add Reply</h4>
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="border-white/20 bg-white/5 mb-3"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedTicket(null)}
                        variant="outline"
                        className="border-white/20 text-foreground hover:bg-white/5"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => addReply(selectedTicket.id)}
                        disabled={!replyText.trim() || replyLoading}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Send size={16} className="mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}