import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function useReducedMotionOrLowPower() {
  const fr = useReducedMotion();
  const [low, setLow] = useState(false);
  useEffect(() => {
    const isLow = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 3;
    setLow(Boolean(isLow));
  }, []);
  return fr || low;
}