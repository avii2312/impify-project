import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import axiosInstance from '@/api/axios';
import {
  Coins,
  Package,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminTokens({ onLogout }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  async function fetchPacks() {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/token-packs");
      setPacks(res.data.token_packs || []);
    } catch (error) {
      console.error('Failed to load token packs:', error);
      setPacks([]);
      toast.error('Failed to load token packs');
    } finally {
      setLoading(false);
    }
  }

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
              <p className="text-muted-foreground">Loading token packs...</p>
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
                Token{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-muted-foreground max-w-xl mt-2">
                Manage token packs and pricing
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={fetchPacks}
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </Button>
              <Button
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <Plus size={20} className="mr-2" />
                Add Pack
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Coins size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{packs.length}</p>
                    <p className="text-sm text-muted-foreground">Token Packs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {packs.reduce((sum, pack) => sum + pack.tokens, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Tokens</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Coins size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{packs.reduce((sum, pack) => sum + pack.price_in_inr, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(packs.reduce((sum, pack) => sum + pack.price_in_inr, 0) / packs.length || 0).toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Token Packs</h2>
              <Badge className="bg-white/10 text-foreground border-white/20">
                {packs.length} Packs
              </Badge>
            </div>

            {packs.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg text-foreground font-medium">No token packs found</p>
                  <p className="text-muted-foreground">Token packs will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack, index) => (
                  <Card
                    key={pack.id}
                    className="glass-card hover-lift"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-foreground">{pack.name}</CardTitle>
                          <CardDescription>{pack.tokens} tokens</CardDescription>
                        </div>
                        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                          ₹{pack.price_in_inr}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-foreground hover:bg-white/10"
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-foreground hover:bg-white/10"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
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