import * as React from 'react';
import { useEffect, useRef } from 'react';
import { message } from 'antd';
import { AxiosResponse } from 'axios';
import { autorun, reaction } from 'mobx';
import { allTags } from '@/utils/constants';
import { ITag } from '@/utils/interfaces';
import { useHistory } from 'react-router-dom';

// Side effect hook that runs only after the component is mounted
export const useDidMountEffect = (effect: () => void, deps?: React.DependencyList): void => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      effect();
    } else {
      didMount.current = true;
    }
  }, deps);
};

// Hook that returns the subscription status of a component
export const useIsSubscribed = (): boolean => {
  const isSubscribed = useRef(true);
  useEffect(() => {
    return () => {
      isSubscribed.current = false;
    };
  }, []);
  return isSubscribed.current;
};

// TODO: remove `mobx`
// Side effect hook that wraps `autorun()`
export const useAutorun = (effect: (isSubscribed: boolean) => void | Promise<void>): void => {
  useEffect(() => {
    let isSubscribed = true;
    const disposer = autorun(() => {
      effect(isSubscribed);
    });
    // Cancel side effect on component destruction
    return () => {
      isSubscribed = false;
      disposer();
    };
  }, []);
};

// Side effect hook that wraps `reaction()`
export const useReaction = <T>(
  expression: () => T,
  effect: (arg: T, isSubscribed: boolean) => void | Promise<void>
): void => {
  useEffect(() => {
    let isSubscribed = true;
    const disposer = reaction(expression, (arg) => {
      effect(arg, isSubscribed);
    });
    // Cancel side effect on component destruction
    return () => {
      isSubscribed = false;
      disposer();
    };
  }, []);
};

// Request wrapper with error handling
export const useRequest = async <T>(res: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const r = await res;
    return r.data;
  } catch (err) {
    message.error(`${err.name}: ${err.message}`);
  }
};

// Sort tags
export const sortTags = (tags: ITag[]): ITag[] =>
  tags.sort((a, b) => allTags.findIndex((value) => value === a) - allTags.findIndex((value) => value === b));

// Prioritize empty values in the list
export const prioritizeNull = <T>(items: T[]): T[] => items.sort((a, b) => (a === null ? 0 : 1) - (b === null ? 0 : 1));
