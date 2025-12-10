import { useRef } from "react";

export default function usePreventDoubleClick(timeout = 1200) {
  const ref = useRef(false);
  const tryCall = (fn) => {
    if (ref.current) return false;
    ref.current = true;
    try {
      fn();
    } finally {
      setTimeout(() => (ref.current = false), timeout);
    }
    return true;
  };
  return tryCall;
}