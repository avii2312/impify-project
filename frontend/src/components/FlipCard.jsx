import React, { useState } from "react";
import { motion } from "framer-motion";

const FlipCard = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000">
      <motion.div
        className={`relative w-full h-[320px]`}
        onClick={() => setFlipped(f => !f)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d", cursor: "pointer" }}
      >
        <div className="absolute w-full h-full backface-hidden bg-white/95 rounded-lg p-8 flex items-center justify-center text-center">
          {front}
        </div>
        <div className="absolute w-full h-full backface-hidden rounded-lg p-8 flex items-center justify-center text-center" style={{ transform: "rotateY(180deg)" }}>
          {back}
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;