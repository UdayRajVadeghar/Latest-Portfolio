"use client";

import { parseSSEStream } from "@/lib/sse-parser";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChatSession } from "./useChatSession";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

export interface ChatbotError {
  message: string;
  canRetry: boolean;
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatbotError | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const { sessionId, setSessionId, clearSession, refreshSession } =
    useChatSession();

  const messageIdCounter = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasWarmedUp = useRef(false);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const addUserMessage = useCallback((text: string): Message => {
    const message: Message = {
      id: messageIdCounter.current++,
      text,
      sender: "user",
      timestamp: getTimestamp(),
    };
    setMessages((prev) => [...prev, message]);
    return message;
  }, []);

  const updateAIMessage = useCallback(
    (messageId: number, text: string, isComplete: boolean = false) => {
      setMessages((prev) => {
        const existingIndex = prev.findIndex((m) => m.id === messageId);

        const aiMessage: Message = {
          id: messageId,
          text,
          sender: "ai",
          timestamp: getTimestamp(),
        };

        if (existingIndex >= 0) {
          const newMessages = [...prev];
          newMessages[existingIndex] = aiMessage;
          return newMessages;
        } else {
          return [...prev, aiMessage];
        }
      });

      return isComplete;
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) {
        return;
      }

      setError(null);
      setIsLoading(true);

      addUserMessage(text);

      abortControllerRef.current = new AbortController();

      try {
        const requestBody = {
          message: text,
          session_id: sessionId || "",
        };

        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(
            `API request failed with status ${response.status}: ${response.statusText}`
          );
        }

        const newSessionId = response.headers.get("X-Session-Id");
        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
        }

        const aiMessageId = messageIdCounter.current++;
        let accumulatedText = "";
        let isFirstChunk = true;

        await parseSSEStream(
          response,
          (chunk) => {
            if (isFirstChunk) {
              setIsStreaming(true);
              isFirstChunk = false;
            }
            accumulatedText += chunk;
            updateAIMessage(aiMessageId, accumulatedText, false);
          },
          (streamError) => {
            console.error("Stream error:", streamError);
            throw streamError;
          }
        );

        updateAIMessage(aiMessageId, accumulatedText, true);

        refreshSession();

        setIsStreaming(false);
        setIsLoading(false);
      } catch (err) {
        console.error("Chatbot error:", err);

        if (err instanceof Error && err.name === "AbortError") {
          console.log("Request aborted");
          setIsLoading(false);
          setIsStreaming(false);
          return;
        }

        clearSession();

        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";

        setError({
          message: errorMessage,
          canRetry: true,
        });

        setIsLoading(false);
        setIsStreaming(false);

        const errorMessageId = messageIdCounter.current++;
        updateAIMessage(
          errorMessageId,
          "Sorry, I encountered an error. Please try sending your message again.",
          true
        );
      }
    },
    [
      sessionId,
      isLoading,
      setSessionId,
      refreshSession,
      clearSession,
      addUserMessage,
      updateAIMessage,
    ]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    messageIdCounter.current = 0;
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.sender === "user");

    if (lastUserMessage) {
      setMessages((prev) =>
        prev.filter((m) => !(m.sender === "ai" && m.text.includes("error")))
      );
      setError(null);
      sendMessage(lastUserMessage.text);
    }
  }, [messages, sendMessage]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const warmupServer = useCallback(async () => {
    // Send a warmup request to start the server without persisting messages
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "hi",
          session_id: sessionId || "",
        }),
      });

      // Consume the response to complete the request
      if (response.ok && response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      }
    } catch (err) {
      // Silently fail - this is just a warmup request
      console.log("Warmup request completed");
    }
  }, [sessionId]);

  // Warmup the server on mount
  useEffect(() => {
    if (!hasWarmedUp.current) {
      hasWarmedUp.current = true;
      warmupServer();
    }
  }, [warmupServer]);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sessionId,
    sendMessage,
    clearMessages,
    retryLastMessage,
    cancelRequest,
  };
}
