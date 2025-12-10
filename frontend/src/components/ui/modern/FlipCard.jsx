import React, { useState } from "react";
import { motion } from "framer-motion";

/* ---------------------------
   FLIP CARD
   --------------------------- */
const FlipCard = ({ front = "Q", back = "A" }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="w-80 h-44 perspective-1000">
      <motion.div
        onClick={() => setFlipped((s) => !s)}
        className={`relative w-full h-full transform-style-preserve-3d cursor-pointer`}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 backface-hidden bg-white/6 rounded-xl p-6 flex items-center justify-center">
          <div className="text-slate-200 font-semibold">{front}</div>
        </div>
        <div
          className="absolute inset-0 backface-hidden flashcard-back bg-white/8 rounded-xl p-6 flex items-center justify-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="text-slate-200 font-medium">{back}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;