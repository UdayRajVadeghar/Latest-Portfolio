"use client";

import { Card } from "@/components/ui/card";
import { useChatbot } from "@/hooks/useChatbot";
import { AlertCircle, Bot, Loader2, RefreshCw, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    retryLastMessage,
  } = useChatbot();

  const [inputValue, setInputValue] = useState("");
  const [shouldMaintainFocus, setShouldMaintainFocus] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_MESSAGE_LENGTH = 1000;

  const firstLoadingMessages = [
    "Initializing chat... This may take up to 20 seconds",
    "Cold starting the server... Please wait",
    "Warming up the AI engine...",
    "Almost there... Setting up your session",
  ];

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (shouldMaintainFocus && inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [messages, isStreaming, shouldMaintainFocus, isLoading]);

  useEffect(() => {
    if (isLoading && !isStreaming && messages.length === 1) {
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % firstLoadingMessages.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLoading, isStreaming, messages.length, firstLoadingMessages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) {
      return;
    }

    if (inputValue.length > MAX_MESSAGE_LENGTH) {
      setValidationError(
        `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    setValidationError(null);
    sendMessage(inputValue);
    setInputValue("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRetry = () => {
    retryLastMessage();
  };

  const handleFocus = () => {
    setShouldMaintainFocus(true);
  };

  const handleBlur = () => {
    setShouldMaintainFocus(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > MAX_MESSAGE_LENGTH) {
      setValidationError(
        `Message is too long (${value.length}/${MAX_MESSAGE_LENGTH} characters)`
      );
    } else {
      setValidationError(null);
    }
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/20">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg">
                Chat with Uday's AI
              </h3>
              <p className="text-xs sm:text-sm opacity-90 truncate">
                Ask me anything about my experience
              </p>
            </div>
            {isStreaming && (
              <div className="flex items-center gap-2 text-xs sm:text-sm shrink-0 bg-primary-foreground/10 px-3 py-1.5 rounded-full">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Typing...</span>
              </div>
            )}
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-muted/30 to-muted/10 h-[480px] overflow-y-auto scroll-smooth"
          id="chat-messages"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border border-primary/20">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col items-center">
                  <h4 className="font-semibold text-xl">Welcome! 👋</h4>
                  <p className="text-sm text-muted-foreground max-w-md text-center">
                    I am Uday and I can help you out. Feel free to ask me
                    anything!
                  </p>
                </div>
                <div className="pt-3 space-y-3">
                  <p className="text-xs text-muted-foreground font-medium">
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center px-2">
                    {[
                      "Tell me about your experience",
                      "What technologies do you use?",
                      "What projects have you built?",
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputValue(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-card hover:bg-primary/10 border border-border hover:border-primary/30 rounded-full transition-all duration-200 hover:shadow-md hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center border ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/20 shadow-md"
                          : "bg-card text-primary border-border shadow-sm"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      ) : (
                        <Bot className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div
                        className={`rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-md shadow-md border border-primary/20"
                            : "bg-card text-card-foreground rounded-tl-md shadow-sm border border-border"
                        }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs text-muted-foreground px-2 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && !isStreaming && messages.length > 0 && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%]">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center bg-card text-primary border border-border shadow-sm">
                      <Bot className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </div>
                    <div className="rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 bg-card text-card-foreground rounded-tl-md shadow-sm border border-border">
                      {messages.length === 1 ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">
                            {firstLoadingMessages[loadingMessageIndex]}
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <div className="px-4 sm:px-6 py-4 bg-destructive/10 border-t border-destructive/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive font-medium">{error.message}</p>
              </div>
              {error.canRetry && (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm bg-destructive text-destructive-foreground rounded-full hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Retry</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-5 border-t bg-muted/20 backdrop-blur-sm">
          {validationError && (
            <div className="mb-3 px-4 py-2.5 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-xs sm:text-sm text-destructive font-medium">
                {validationError}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={
                isLoading ? "Waiting for response..." : "Type your message..."
              }
              className={`flex-1 px-4 sm:px-5 py-3 rounded-full border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-base transition-all duration-200 ${
                validationError ? "border-destructive focus:ring-destructive/50" : "border-border"
              }`}
              autoComplete="off"
              maxLength={MAX_MESSAGE_LENGTH + 100}
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-full font-medium text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 shrink-0"
              disabled={isLoading || !inputValue.trim() || !!validationError}
              aria-label={isLoading ? "Sending message" : "Send message"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </form>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-2 mt-3">
            <p className="text-xs text-muted-foreground order-2 sm:order-1">
              Session expires after 5 minutes of inactivity
            </p>
            <p
              className={`text-xs order-1 sm:order-2 text-right sm:text-left font-medium ${
                inputValue.length > MAX_MESSAGE_LENGTH
                  ? "text-destructive"
                  : inputValue.length > MAX_MESSAGE_LENGTH * 0.9
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {inputValue.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
