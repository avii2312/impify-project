import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ---------------------------
   INTERACTIVE 3D CARD (basic)
   --------------------------- */
const Interactive3DCard = ({ title = "Interactive Card", children }) => {
  const ref = useRef();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Throttle mousemove for performance
  const throttledSetPos = useCallback(
    (() => {
      let timeoutId = null;
      return (x, y) => {
        if (timeoutId) return;
        timeoutId = setTimeout(() => {
          setPos({ x, y });
          timeoutId = null;
        }, 16); // ~60fps
      };
    })(),
    []
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isHovering) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      throttledSetPos(x, y);
    },
    [isHovering, throttledSetPos]
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setPos({ x: 0, y: 0 });
      }}
    >
      <motion.div
        style={{ perspective: 1000 }}
        animate={{
          rotateY: pos.x * 6,
          rotateX: -pos.y * 6,
          translateZ: 0
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="bg-white/6 border border-white/6 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-slate-300">Live</div>
        </div>
        <div className="text-sm text-slate-300">{children}</div>
      </motion.div>
    </div>
  );
};

export default Interactive3DCard;