import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { Settings, Save, RefreshCw, Shield, Database, Mail, Key, Globe, Cpu, Zap, Clock, Lock } from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import { Button } from '@/components/ui/button';

const SettingSection = ({ title, description, icon: Icon, color, children, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
    <div className="flex items-start gap-4 mb-6">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}><Icon size={22} className="text-white" /></div>
      <div><h3 className="text-lg font-semibold text-white">{title}</h3><p className="text-sm text-white/50">{description}</p></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </motion.div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
    <select value={value} onChange={onChange} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 transition-colors">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const ToggleField = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 md:col-span-2">
    <div><p className="font-medium text-white">{label}</p><p className="text-sm text-white/50">{description}</p></div>
    <button onClick={() => onChange(!checked)} className={`relative w-14 h-7 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-white/20'}`}>
      <motion.div animate={{ x: checked ? 28 : 4 }} className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md" />
    </button>
  </div>
);

export default function AdminSettings({ onLogout }) {
  const [settings, setSettings] = useState({
    system: { maintenance_mode: false, max_file_size: 50, rate_limit_requests: 100, rate_limit_window: 60 },
    ai: { openai_enabled: true, gemini_enabled: false, ollama_enabled: false, openai_model: 'gpt-4o-mini', max_tokens: 4000, temperature: 0.7 },
    email: { smtp_enabled: false, smtp_host: '', smtp_port: 587, from_email: '', from_name: '' },
    security: { jwt_expiry_days: 7, password_min_length: 8, enable_2fa: false, session_timeout: 3600 }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      if (response.data) setSettings(prev => ({ ...prev, ...response.data }));
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const resetToDefaults = async () => {
    if (!window.confirm('Reset all settings to defaults? This cannot be undone.')) return;
    try {
      await adminAPI.resetSettings();
      toast.success('Settings reset to defaults');
      fetchSettings();
    } catch (error) { toast.error('Failed to reset settings'); }
  };

  const testEmail = async () => {
    try {
      await adminAPI.testEmail();
      toast.success('Test email sent');
    } catch (error) { toast.error('Failed to send test email'); }
  };

  const update = (category, key, value) => setSettings(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <AdminSidebar onLogout={handleLogout} />
        <div className="lg:pl-72 p-6"><div className="flex items-center justify-center min-h-[80vh]"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full" /></div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent" /></div>
      <AdminSidebar onLogout={handleLogout} />
      <div className="lg:pl-72">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700"><Settings size={28} className="text-white" /></div>
              <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Settings</h1><p className="text-white/50 mt-1">Configure platform settings</p></div>
            </div>
            <div className="flex gap-3">
              <Button onClick={resetToDefaults} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"><RefreshCw size={16} className="mr-2" />Reset</Button>
              <Button onClick={saveSettings} disabled={saving} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"><Save size={16} className="mr-2" />{saving ? 'Saving...' : 'Save Settings'}</Button>
            </div>
          </motion.div>

          <div className="space-y-6">
            <SettingSection title="System Configuration" description="General platform settings" icon={Database} color="from-blue-500 to-cyan-500" delay={0.1}>
              <ToggleField label="Maintenance Mode" description="Temporarily disable access for users" checked={settings.system.maintenance_mode} onChange={(v) => update('system', 'maintenance_mode', v)} />
              <InputField label="Max File Size (MB)" value={settings.system.max_file_size} onChange={(e) => update('system', 'max_file_size', parseInt(e.target.value) || 0)} type="number" />
              <InputField label="Rate Limit (requests)" value={settings.system.rate_limit_requests} onChange={(e) => update('system', 'rate_limit_requests', parseInt(e.target.value) || 0)} type="number" />
              <InputField label="Rate Window (seconds)" value={settings.system.rate_limit_window} onChange={(e) => update('system', 'rate_limit_window', parseInt(e.target.value) || 0)} type="number" />
            </SettingSection>

            <SettingSection title="AI Configuration" description="AI model and provider settings" icon={Cpu} color="from-purple-500 to-pink-500" delay={0.2}>
              <ToggleField label="OpenAI" description="Enable OpenAI API integration" checked={settings.ai.openai_enabled} onChange={(v) => update('ai', 'openai_enabled', v)} />
              <SelectField label="OpenAI Model" value={settings.ai.openai_model} onChange={(e) => update('ai', 'openai_model', e.target.value)}
                options={[{ value: 'gpt-4o-mini', label: 'GPT-4o Mini' }, { value: 'gpt-4o', label: 'GPT-4o' }, { value: 'gpt-4', label: 'GPT-4' }, { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }]} />
              <InputField label="Max Tokens" value={settings.ai.max_tokens} onChange={(e) => update('ai', 'max_tokens', parseInt(e.target.value) || 0)} type="number" />
              <InputField label="Temperature" value={settings.ai.temperature} onChange={(e) => update('ai', 'temperature', parseFloat(e.target.value) || 0)} type="number" />
            </SettingSection>

            <SettingSection title="Email Configuration" description="SMTP settings for notifications" icon={Mail} color="from-amber-500 to-orange-500" delay={0.3}>
              <ToggleField label="SMTP Enabled" description="Enable email notifications" checked={settings.email.smtp_enabled} onChange={(v) => update('email', 'smtp_enabled', v)} />
              <InputField label="SMTP Host" value={settings.email.smtp_host} onChange={(e) => update('email', 'smtp_host', e.target.value)} placeholder="smtp.gmail.com" disabled={!settings.email.smtp_enabled} />
              <InputField label="SMTP Port" value={settings.email.smtp_port} onChange={(e) => update('email', 'smtp_port', parseInt(e.target.value) || 0)} type="number" disabled={!settings.email.smtp_enabled} />
              <InputField label="From Email" value={settings.email.from_email} onChange={(e) => update('email', 'from_email', e.target.value)} placeholder="noreply@example.com" disabled={!settings.email.smtp_enabled} />
              <InputField label="From Name" value={settings.email.from_name} onChange={(e) => update('email', 'from_name', e.target.value)} placeholder="Impify" disabled={!settings.email.smtp_enabled} />
              <div className="md:col-span-2">
                <Button onClick={testEmail} disabled={!settings.email.smtp_enabled} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 disabled:opacity-50">
                  <Mail size={16} className="mr-2" />Send Test Email
                </Button>
              </div>
            </SettingSection>

            <SettingSection title="Security Settings" description="Authentication and security configuration" icon={Shield} color="from-emerald-500 to-teal-500" delay={0.4}>
              <ToggleField label="Two-Factor Authentication" description="Require 2FA for admin accounts" checked={settings.security.enable_2fa} onChange={(v) => update('security', 'enable_2fa', v)} />
              <InputField label="JWT Expiry (days)" value={settings.security.jwt_expiry_days} onChange={(e) => update('security', 'jwt_expiry_days', parseInt(e.target.value) || 0)} type="number" />
              <InputField label="Min Password Length" value={settings.security.password_min_length} onChange={(e) => update('security', 'password_min_length', parseInt(e.target.value) || 0)} type="number" />
              <InputField label="Session Timeout (seconds)" value={settings.security.session_timeout} onChange={(e) => update('security', 'session_timeout', parseInt(e.target.value) || 0)} type="number" />
            </SettingSection>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-500"><Lock size={22} className="text-white" /></div>
                <div><h3 className="text-lg font-semibold text-white">Danger Zone</h3><p className="text-sm text-white/50">Irreversible and destructive actions</p></div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => toast.info('Database backup coming soon')} className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10">
                  <Database size={16} className="mr-2" />Backup Database
                </Button>
                <Button onClick={() => toast.info('Cache clear coming soon')} className="bg-white/5 hover:bg-white/10 text-white/70 border border-white/10">
                  <Zap size={16} className="mr-2" />Clear Cache
                </Button>
                <Button onClick={resetToDefaults} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20">
                  <RefreshCw size={16} className="mr-2" />Reset All Settings
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
