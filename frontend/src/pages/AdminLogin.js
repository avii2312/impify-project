import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios'; // ✅ Use axiosInstance
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Lock, User } from 'lucide-react';
import { ENDPOINTS } from '@/api/api';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (email, password) => {
    try {
      console.log('🔐 Admin Login Attempt:', email);

      const response = await axiosInstance.post('/admin/auth/login', {
        email,
        password
      });

      console.log('✅ Login Response:', response.data);

      // Check if we got a token and user data
      if (response.data.token && response.data.user) {
        console.log('🎯 Login Successful - User:', response.data.user);

        // Store the token
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));

        console.log('💾 Token stored:', response.data.token.substring(0, 20) + '...');
        console.log('👤 User stored:', response.data.user);

        // Force redirect to admin panel
        window.location.href = '/admin/dashboard';

      } else {
        console.error('❌ No token or user data in response');
      }

    } catch (error) {
      console.error('💥 Login Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Starting admin login...');

      const response = await axiosInstance.post('/admin/auth/login', {
        email,
        password
      });

      console.log('✅ Login Response:', response.data);

      if (response.data.token && response.data.user) {
        // Store admin-specific tokens
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));

        console.log('💾 Admin token stored:', response.data.token.substring(0, 20) + '...');
        console.log('👤 Admin user stored:', response.data.user);

        // Force reload to trigger admin authentication in App.js
        window.location.href = '/admin/dashboard';

      } else {
        console.error('❌ No token or user data in response');
        toast.error('Invalid response from server');
      }

    } catch (error) {
      console.error('💥 Login Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      const errorMsg = error.response?.data?.error || 'Admin login failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md glass-card border-2 border-primary/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <Shield size={40} className="text-primary" strokeWidth={2.5} />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            ADMIN ACCESS
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Authorized personnel only
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="email" className="block mb-2 font-semibold text-foreground">
                ADMIN EMAIL
              </Label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@impify.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block mb-2 font-semibold text-foreground">
                ACCESS CODE
              </Label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter access code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield size={18} />
                  GRANT ACCESS
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
            <p className="text-yellow-500 text-sm font-semibold mb-1">
              ⚠ AUTHORIZED ACCESS ONLY
            </p>
            <p className="text-muted-foreground text-xs">
              Unauthorized access attempts are logged
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}