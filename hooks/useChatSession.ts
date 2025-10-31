"use client";

import useSessionStorage from "@/lib/session/useSessionStorage";
import { useCallback } from "react";

const SESSION_KEY = "chat_session_id";
const SESSION_TTL = 5 * 60 * 1000;

export function useChatSession() {
  const {
    value: sessionId,
    save,
    clear,
    touch,
  } = useSessionStorage(SESSION_KEY, null, SESSION_TTL);

  const setSessionId = useCallback(
    (id: string) => {
      save(id);
    },
    [save]
  );

  const clearSession = useCallback(() => {
    clear();
  }, [clear]);

  const refreshSession = useCallback(() => {
    touch();
  }, [touch]);

  return {
    sessionId: sessionId as string | null,
    setSessionId,
    clearSession,
    refreshSession,
  };
}
