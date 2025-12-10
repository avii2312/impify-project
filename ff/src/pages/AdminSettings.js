import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Database,
  Mail,
  Key,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import { motion } from 'framer-motion';

export default function AdminSettings({ onLogout }) {
  const [settings, setSettings] = useState({
    system: {
      maintenance_mode: false,
      max_file_size: 50,
      rate_limit_requests: 100,
      rate_limit_window: 60
    },
    ai: {
      openai_enabled: true,
      gemini_enabled: false,
      ollama_enabled: false,
      openai_model: 'gpt-4o-mini',
      ollama_model: 'llama3:8b',
      max_tokens: 4000,
      temperature: 0.7
    },
    email: {
      smtp_enabled: false,
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      from_email: '',
      from_name: ''
    },
    security: {
      jwt_expiry_days: 7,
      password_min_length: 8,
      enable_2fa: false,
      session_timeout: 3600
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      setSettings(response.data || {});
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings({});
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testEmailSettings = async () => {
    try {
      await adminAPI.testEmail();
      toast.success('Test email sent successfully');
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  const resetToDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) return;

    try {
      await adminAPI.resetSettings();
      toast.success('Settings reset to defaults');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to reset settings');
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
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
              <p className="text-white/70">Loading settings...</p>
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
            className="flex justify-between items-center mb-10 flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                <Settings size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  System{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Settings
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-xl mt-2">
                  Configure platform settings and preferences
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={resetToDefaults}
                variant="outline"
                className="border-red-500/20 text-red-500 hover:bg-red-500/10"
              >
                <RefreshCw size={16} className="mr-2" />
                Reset Defaults
              </Button>
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="spinner mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* System Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database size={24} className="text-cyan-400" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>General platform settings and limits</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Maintenance Mode
                    </Label>
                    <Select
                      value={settings.system.maintenance_mode.toString()}
                      onValueChange={(value) => updateSetting('system', 'maintenance_mode', value === 'true')}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Disabled</SelectItem>
                        <SelectItem value="true">Enabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Max File Size (MB)
                    </Label>
                    <Input
                      type="number"
                      value={settings.system.max_file_size}
                      onChange={(e) => updateSetting('system', 'max_file_size', parseInt(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Rate Limit (requests)
                    </Label>
                    <Input
                      type="number"
                      value={settings.system.rate_limit_requests}
                      onChange={(e) => updateSetting('system', 'rate_limit_requests', parseInt(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Rate Limit Window (minutes)
                    </Label>
                    <Input
                      type="number"
                      value={settings.system.rate_limit_window}
                      onChange={(e) => updateSetting('system', 'rate_limit_window', parseInt(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key size={24} className="text-green-400" />
                    AI Configuration
                  </CardTitle>
                  <CardDescription>Configure AI providers and processing settings</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      OpenAI Enabled
                    </Label>
                    <Select
                      value={settings.ai.openai_enabled.toString()}
                      onValueChange={(value) => updateSetting('ai', 'openai_enabled', value === 'true')}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      OpenAI Model
                    </Label>
                    <Select
                      value={settings.ai.openai_model}
                      onValueChange={(value) => updateSetting('ai', 'openai_model', value)}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Max Tokens
                    </Label>
                    <Input
                      type="number"
                      value={settings.ai.max_tokens}
                      onChange={(e) => updateSetting('ai', 'max_tokens', parseInt(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Temperature
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={settings.ai.temperature}
                      onChange={(e) => updateSetting('ai', 'temperature', parseFloat(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Email Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail size={24} className="text-yellow-400" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>SMTP settings for email notifications</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      SMTP Enabled
                    </Label>
                    <Select
                      value={settings.email.smtp_enabled.toString()}
                      onValueChange={(value) => updateSetting('email', 'smtp_enabled', value === 'true')}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Disabled</SelectItem>
                        <SelectItem value="true">Enabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      SMTP Host
                    </Label>
                    <Input
                      value={settings.email.smtp_host}
                      onChange={(e) => updateSetting('email', 'smtp_host', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      SMTP Port
                    </Label>
                    <Input
                      type="number"
                      value={settings.email.smtp_port}
                      onChange={(e) => updateSetting('email', 'smtp_port', parseInt(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      From Email
                    </Label>
                    <Input
                      type="email"
                      value={settings.email.from_email}
                      onChange={(e) => updateSetting('email', 'from_email', e.target.value)}
                      placeholder="noreply@impify.com"
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Test Email
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="test@example.com"
                        className="border-white/20 bg-white/5 flex-1"
                      />
                      <Button
                        onClick={testEmailSettings}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Mail size={16} className="mr-2" />
                        Send Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={24} className="text-red-400" />
                    Security Configuration
                  </CardTitle>
                  <CardDescription>Authentication and security settings</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      JWT Expiry (days)
                    </Label>
                    <Input
                      type="number"
                      value={settings.security.jwt_expiry_days}
                      onChange={(e) => updateSetting('security', 'jwt_expiry_days', parseInt(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Min Password Length
                    </Label>
                    <Input
                      type="number"
                      value={settings.security.password_min_length}
                      onChange={(e) => updateSetting('security', 'password_min_length', parseInt(e.target.value))}
                      className="border-white/20 bg-white/5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Two-Factor Authentication
                    </Label>
                    <Select
                      value={settings.security.enable_2fa.toString()}
                      onValueChange={(value) => updateSetting('security', 'enable_2fa', value === 'true')}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Disabled</SelectItem>
                        <SelectItem value="true">Enabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      type="number"
                      value={settings.security.session_timeout / 60}
                      onChange={(e) => updateSetting('security', 'session_timeout', parseInt(e.target.value) * 60)}
                      className="border-white/20 bg-white/5"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}