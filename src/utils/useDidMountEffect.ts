import * as React from 'react';
import { useEffect, useRef } from 'react';

const useDidMountEffect = (func: React.EffectCallback, deps: React.DependencyList): void => {
  const didMount = useRef<boolean>(false);
  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};

export { useDidMountEffect };
