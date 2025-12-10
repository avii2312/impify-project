import { motion } from "framer-motion";
export const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.35 } };

export function MotionWrapper({ children }) {
  return <motion.div initial="initial" animate="animate" exit="exit" variants={{ initial: fadeIn.initial, animate: fadeIn.animate, exit: fadeIn.exit }}>{children}</motion.div>;
}