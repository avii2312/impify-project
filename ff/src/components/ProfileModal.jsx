import React from "react";
import { motion } from "framer-motion";
import { LogOut, Users, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ open, onClose, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  const handleCommunity = () => {
    navigate("/community");
    onClose();
  };

  const handleSupport = () => {
    navigate("/support");
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-60">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/6 backdrop-blur p-6 rounded-2xl border border-white/10">
        <div className="mb-4">
          <div className="text-lg text-white font-semibold">{user?.name || user?.email}</div>
          <div className="text-sm text-slate-300">Manage account settings</div>
        </div>

        <div className="space-y-3">
          <button className="w-full px-4 py-2 rounded-md bg-white/6 text-white">Account settings</button>
          <button onClick={handleCommunity} className="w-full px-4 py-2 rounded-md bg-blue-600/20 text-white hover:bg-blue-600/30 flex items-center justify-center gap-2">
            <Users /> Community
          </button>
          <button onClick={handleSupport} className="w-full px-4 py-2 rounded-md bg-green-600/20 text-white hover:bg-green-600/30 flex items-center justify-center gap-2">
            <Headphones /> Support
          </button>
          <button onClick={handleLogout} className="w-full px-4 py-2 rounded-md bg-red-600 text-white flex items-center justify-center gap-2">
            <LogOut /> Sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;