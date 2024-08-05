import React from 'react';

export function useDebouncedMemo<T>(
  timeout: number,
  calculator: () => T,
  deps?: React.DependencyList,
) {
  const [state, setState] = React.useState<T>(calculator());

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setState(calculator());
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
