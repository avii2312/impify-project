import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, Edit, Key, Save, X, Eye, EyeOff, Mail, Calendar, Activity, FileText, Folder, Zap, Upload, Users, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import { ENDPOINTS } from "@/api/api";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Form data
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleSupport = () => {
    navigate("/support");
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.userProfile);
      setProfileData(response.data);
      setProfileForm({
        name: response.data.user.name || '',
        email: response.data.user.email || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setSaving(true);
      const response = await axiosInstance.put(ENDPOINTS.userProfile, profileForm);

      setProfileData(prev => ({
        ...prev,
        user: response.data.user
      }));

      updateUser(response.data.user);
      setEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.put(ENDPOINTS.userPassword, passwordForm);

      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setEditingPassword(false);
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingProfile(false);
    setEditingPassword(false);
    setProfileForm({
      name: profileData?.user?.name || '',
      email: profileData?.user?.email || ''
    });
    setPasswordForm({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 pb-safe">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Profile Header */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto sm:mx-0">
                <User size={32} className="text-white sm:w-10 sm:h-10 md:w-[40px] md:h-[40px]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  {profileData?.user?.name || "User"}
                </h1>
                <p className="text-slate-300 mb-2 text-sm sm:text-base">{profileData?.user?.email}</p>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>Joined {new Date(profileData?.user?.created_at).toLocaleDateString()}</span>
                  </div>
                  {profileData?.user?.last_login && (
                    <div className="flex items-center gap-1">
                      <Activity size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>Last login {new Date(profileData?.user?.last_login).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 text-center touch-manipulation"
            >
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{profileData?.stats?.total_notes || 0}</div>
              <div className="text-xs text-slate-400">Notes</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 text-center touch-manipulation"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{profileData?.stats?.total_flashcards || 0}</div>
              <div className="text-xs text-slate-400">Flashcards</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 text-center touch-manipulation"
            >
              <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{profileData?.stats?.total_folders || 0}</div>
              <div className="text-xs text-slate-400">Folders</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 text-center touch-manipulation"
            >
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{profileData?.stats?.total_uploads || 0}</div>
              <div className="text-xs text-slate-400">Uploads</div>
            </motion.div>
          </div>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <User size={18} className="sm:w-5 sm:h-5" />
                  Profile Information
                </h3>
                {!editingProfile && (
                  <Button
                    onClick={() => setEditingProfile(true)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-white/10 touch-manipulation"
                  >
                    <Edit size={14} className="sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editingProfile ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={saving}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save size={16} className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="ghost"
                        disabled={saving}
                        className="flex-1 hover:bg-white/10"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <User size={16} className="text-slate-400" />
                      <div>
                        <div className="text-sm text-slate-400">Name</div>
                        <div className="text-white">{profileData?.user?.name || 'Not set'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Mail size={16} className="text-slate-400" />
                      <div>
                        <div className="text-sm text-slate-400">Email</div>
                        <div className="text-white">{profileData?.user?.email}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <Key size={18} className="sm:w-5 sm:h-5" />
                  Password & Security
                </h3>
                {!editingPassword && (
                  <Button
                    onClick={() => setEditingPassword(true)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-white/10 touch-manipulation"
                  >
                    <Edit size={14} className="sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {editingPassword ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Current Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword.current ? "text" : "password"}
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                          placeholder="Enter current password"
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-10"
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                        >
                          {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword.new ? "text" : "password"}
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                          placeholder="Enter new password"
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-10"
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                        >
                          {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwordForm.confirm_password}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                          placeholder="Confirm new password"
                          className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-10"
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/10"
                        >
                          {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={saving}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {saving ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Changing...
                          </div>
                        ) : (
                          <>
                            <Key size={16} className="mr-2" />
                            Change Password
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="ghost"
                        disabled={saving}
                        className="flex-1 hover:bg-white/10"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Key size={16} className="text-slate-400" />
                      <div>
                        <div className="text-sm text-slate-400">Password</div>
                        <div className="text-white">••••••••</div>
                      </div>
                    </div>

                    <div className="text-sm text-slate-400">
                      Last changed: Never (set a new password to secure your account)
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings size={20} />
              Quick Actions
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCommunity}
                className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border-blue-600/30"
              >
                <Users size={16} className="mr-2" />
                Community
              </Button>
              <Button
                onClick={handleSupport}
                className="flex-1 bg-green-600/20 text-green-400 hover:bg-green-600/30 border-green-600/30"
              >
                <Headphones size={16} className="mr-2" />
                Support
              </Button>
              <Button
                onClick={() => logout('Logged out successfully')}
                variant="destructive"
                className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 border-red-600/30"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;