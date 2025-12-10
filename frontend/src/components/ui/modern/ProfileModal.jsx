import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, Users, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------------------
   PROFILE / SETTINGS MODAL
   --------------------------- */
const ProfileModal = ({ open, onClose, user, onLogout }) => {
  const navigate = useNavigate();

  const handleCommunity = () => {
    navigate("/community");
    onClose();
  };

  const handleSupport = () => {
    navigate("/support");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md bg-white/6 border border-white/6 rounded-2xl p-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                U
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {user?.name || user?.email || "Student"}
                </div>
                <div className="text-sm text-slate-300">{user?.email}</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                className="w-full text-left py-3 px-4 rounded-lg bg-white/4 flex items-center gap-3"
                onClick={() => console.log("Open profile settings")}
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <button
                className="w-full text-left py-3 px-4 rounded-lg bg-blue-600/20 text-white hover:bg-blue-600/30 flex items-center gap-3"
                onClick={handleCommunity}
              >
                <Users className="w-4 h-4" /> Community
              </button>
              <button
                className="w-full text-left py-3 px-4 rounded-lg bg-green-600/20 text-white hover:bg-green-600/30 flex items-center gap-3"
                onClick={handleSupport}
              >
                <Headphones className="w-4 h-4" /> Support
              </button>
              <button
                className="w-full text-left py-3 px-4 rounded-lg bg-white/4 flex items-center gap-3"
                onClick={() => console.log("Open preferences")}
              >
                <span className="w-4 h-4 flex items-center justify-center">🌙</span> Preferences
              </button>
              <button
                className="w-full text-left py-3 px-4 rounded-lg bg-red-600/90 text-white flex items-center gap-3"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Manage your account and session here.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;