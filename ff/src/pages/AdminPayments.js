import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { saveAs } from 'file-saver';
import axiosInstance from '@/api/axios';
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPayments({ onLogout }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/admin/payments");
      setPayments(res.data.payments || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
      setPayments([]);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await axiosInstance.get("/api/admin/stats");
      setStats(res.data || {});
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  async function exportCsv() {
    try {
      const res = await axiosInstance.get("/api/admin/export/payments.csv", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "payments.csv");
      toast.success('Payments exported successfully');
    } catch (error) {
      toast.error('Failed to export payments');
    }
  }

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
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-black to-slate-900 text-white">
        <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
          <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -top-20 -left-10"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-600/25 blur-[120px] rounded-full bottom-5 right-5"></div>
        </div>

        <AdminSidebar onLogout={handleLogout} />

        <div className="pl-80 p-6">
          <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading payments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-black to-slate-900 text-white">
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
        <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -top-20 -left-10"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-600/25 blur-[120px] rounded-full bottom-5 right-5"></div>
      </div>

      <AdminSidebar onLogout={handleLogout} />

      <div className="pl-80 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-10"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                Payment{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-muted-foreground max-w-xl mt-2">
                Monitor transactions and revenue streams
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={fetchPayments}
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </Button>
              <Button
                onClick={exportCsv}
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <Download size={20} className="mr-2" />
                Export CSV
              </Button>
            </div>
          </motion.div>

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
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <DollarSign size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">₹{stats.total_revenue_in_inr || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <CreditCard size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{payments.length}</p>
                      <p className="text-sm text-muted-foreground">Total Payments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.active_premium_users || 0}</p>
                      <p className="text-sm text-muted-foreground">Premium Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Calendar size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_users || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Payment Transactions</h2>
              <Badge className="bg-white/10 text-foreground border-white/20">
                {payments.length} Records
              </Badge>
            </div>

            {payments.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg text-foreground font-medium">No payments found</p>
                  <p className="text-muted-foreground">Payment transactions will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {payments.map((payment, index) => (
                  <Card
                    key={payment.id}
                    className="glass-card hover-lift"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <CreditCard size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground">{payment.user_id || "—"}</p>
                              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                {payment.provider}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {payment.provider_payment_id} • {formatDate(payment.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">₹{payment.amount_in_inr}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}