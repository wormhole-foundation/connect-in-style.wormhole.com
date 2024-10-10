import {Dispatch, SetStateAction, useEffect, useState} from "react";

export type CachedStateOpts<T = any> = {
  serialize: (arg: T) => string;
  deserialize: (arg: string) => T;
}

export function useCachedState<T = any>(localStorageKey: string, defaultValue: T, opts?: CachedStateOpts<T>): [T, Dispatch<SetStateAction<T>>] {
  let initialVal = defaultValue;

  const cachedValue = localStorage.getItem(localStorageKey);
  if (cachedValue) {
    if (opts?.deserialize) {
      initialVal = opts.deserialize(cachedValue);
    } else {
      initialVal = cachedValue as T;
    }
  }

  const [val, setVal] = useState(initialVal);

  useEffect(() => {
    if (opts?.serialize) {
      localStorage.setItem(localStorageKey, opts.serialize(val));
    } else {
      localStorage.setItem(localStorageKey, val as string);
    }
  }, [val]);

  return [val, setVal];
}
