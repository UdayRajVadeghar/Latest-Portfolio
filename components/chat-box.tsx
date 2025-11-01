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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_MESSAGE_LENGTH = 1000;

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
      <Card className="border-2 shadow-2xl">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Chat with Uday's AI</h3>
              <p className="text-xs opacity-90">
                Ask me anything about my experience
              </p>
            </div>
            {isStreaming && (
              <div className="flex items-center gap-2 text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Typing...</span>
              </div>
            )}
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="p-6 space-y-5 bg-muted/20 min-h-[450px] max-h-[550px] overflow-y-auto scroll-smooth"
          id="chat-messages"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-1 flex flex-col items-center">
                  <h4 className="font-semibold text-lg">Welcome! 👋</h4>
                  <p className="text-sm text-muted-foreground max-w-md text-center">
                    I am Uday and I can help you out. Feel free to ask me
                    anything!
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
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
                        className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
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
                    className={`flex gap-2 max-w-[85%] ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-secondary text-secondary-foreground rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                      </div>
                      <span
                        className={`text-xs text-muted-foreground px-2 ${
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
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl px-4 py-2.5 bg-secondary text-secondary-foreground rounded-tl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <div className="px-6 py-3 bg-destructive/10 border-t border-destructive/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error.message}</p>
              </div>
              {error.canRetry && (
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded-full hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 border-t bg-background rounded-b-lg">
          {validationError && (
            <div className="mb-3 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{validationError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
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
              className={`flex-1 px-4 py-2.5 rounded-full border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                validationError ? "border-destructive" : ""
              }`}
              disabled={isLoading}
              autoComplete="off"
              maxLength={MAX_MESSAGE_LENGTH + 100}
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading || !inputValue.trim() || !!validationError}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              Session expires after 5 minutes of inactivity
            </p>
            <p
              className={`text-xs ${
                inputValue.length > MAX_MESSAGE_LENGTH
                  ? "text-destructive font-medium"
                  : inputValue.length > MAX_MESSAGE_LENGTH * 0.9
                  ? "text-[#D97757] font-medium"
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
