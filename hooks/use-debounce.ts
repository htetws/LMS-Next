import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay?: number): T => {
  const [debounce, setDebounce] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(value);
    }, delay || 500);

    return () => clearTimeout(timer);
  }, [delay, value]);

  return debounce;
};
