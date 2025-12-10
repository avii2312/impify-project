import { motion } from "framer-motion";
import AnimatedNumbers from "react-animated-numbers";

export function AnimatedNumber({
  value,
  duration = 1.4,
  className = "",
  fontStyle = {},
  ...props
}) {
  return (
    <motion.div
      className={`font-semibold tracking-tight ${className}`}
      style={fontStyle}
      {...props}
    >
      <AnimatedNumbers
        animateToNumber={value}
        fontStyle={fontStyle}
        transitions={(index) => ({
          type: "spring",
          duration: index * 0.3,
        })}
      />
    </motion.div>
  );
}