import type React from "react";
import { useEffect, useState } from "react";

export function useDebouncedMemo<T>(
  timeout: number,
  calculator: () => T,
  deps?: React.DependencyList,
) {
  const [state, setState] = useState<T>(calculator());

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(calculator());
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, deps);

  return state;
}
