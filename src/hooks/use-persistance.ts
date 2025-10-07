import { useState, useEffect } from "react";
import { Persistence } from "@/utils";

function usePersistence<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = Persistence.getItem<T>(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  useEffect(() => {
    Persistence.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default usePersistence;
