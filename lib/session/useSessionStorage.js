import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearSession,
  getSession,
  setSession,
  touchSession,
} from "./sessionStorageUtil";

export default function useSessionStorage(
  key,
  initialValue = null,
  ttlMs = 5 * 60 * 1000
) {
  const [value, setValue] = useState(() => getSession(key) ?? initialValue);
  const ttlRef = useRef(ttlMs);

  useEffect(() => {
    ttlRef.current = ttlMs;
  }, [ttlMs]);

  const refresh = useCallback(() => {
    const currentValue = getSession(key);
    setValue(currentValue ?? initialValue);
  }, [key, initialValue]);

  const save = useCallback(
    (newValue) => {
      setSession(key, newValue, ttlRef.current);
      setValue(newValue);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`${key}__update`, Date.now().toString());
        } catch (error) {
          console.error("Failed to notify other tabs:", error);
        }
      }
    },
    [key]
  );

  const clear = useCallback(() => {
    clearSession(key);
    setValue(initialValue);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${key}__update`, Date.now().toString());
      } catch (error) {
        console.error("Failed to notify other tabs:", error);
      }
    }
  }, [key, initialValue]);

  const touch = useCallback(() => {
    touchSession(key, ttlRef.current);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${key}__touch`, Date.now().toString());
      } catch (error) {
        console.error("Failed to notify other tabs:", error);
      }
    }
  }, [key]);

  const touchOnSuccess = useCallback(
    async (apiFn) => {
      try {
        const response = await apiFn();

        if (
          response &&
          typeof response === "object" &&
          "ok" in response &&
          !response.ok
        ) {
          console.warn("API call returned non-2xx status, clearing session");
          clear();
          throw new Error(`API failed with status ${response.status}`);
        }

        if (response && typeof response === "object" && "status" in response) {
          const status = response.status;
          if (status < 200 || status >= 300) {
            console.warn("API call returned non-2xx status, clearing session");
            clear();
            throw new Error(`API failed with status ${status}`);
          }
        }

        touch();
        return response;
      } catch (error) {
        console.warn("API call failed, clearing session:", error.message);
        clear();
        throw error;
      }
    },
    [touch, clear]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e) => {
      if (e.key === `${key}__update`) {
        refresh();
      }

      if (e.key === `${key}__touch`) {
        const currentValue = getSession(key);
        if (currentValue !== null) {
          setValue(currentValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, refresh]);

  return {
    value,
    save,
    clear,
    touchOnSuccess,
    touch,
    refresh,
  };
}
