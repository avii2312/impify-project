import { motion } from "framer-motion";

export default function InteractiveCard({ children }) {
  return (
    <motion.div
      whileHover={{ rotateX: 6, rotateY: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 160 }}
      className="glass-card p-5"
    >
      {children}
    </motion.div>
  );
}