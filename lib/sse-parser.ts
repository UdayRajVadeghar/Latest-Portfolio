export interface SSEMessage {
  data: string;
  event?: string;
  id?: string;
  retry?: number;
}

function formatErrorMessage(error: any): string {
  const errorObj = typeof error === "string" ? { message: error } : error;
  const errorCode = errorObj.code || errorObj.status;
  const errorMessage = errorObj.message || error;

  if (
    errorCode === 429 ||
    errorMessage.includes("429") ||
    errorMessage.includes("RESOURCE_EXHAUSTED")
  ) {
    return "Rate limit exceeded. The AI service is currently receiving too many requests. Please wait a moment and try again.";
  }

  if (
    errorCode === 503 ||
    errorMessage.includes("503") ||
    errorMessage.includes("SERVICE_UNAVAILABLE")
  ) {
    return "The AI service is temporarily unavailable. Please try again in a few moments.";
  }

  if (
    errorCode === 500 ||
    errorMessage.includes("500") ||
    errorMessage.includes("INTERNAL")
  ) {
    return "The AI service encountered an internal error. Please try again.";
  }

  if (
    errorCode === 401 ||
    errorCode === 403 ||
    errorMessage.includes("UNAUTHENTICATED") ||
    errorMessage.includes("PERMISSION_DENIED")
  ) {
    return "Authentication error. Please refresh the page and try again.";
  }

  if (typeof errorMessage === "string") {
    return (
      errorMessage
        .replace(/Please refer to https?:\/\/[^\s]+/gi, "")
        .replace(/\{[^}]*\}/g, "")
        .trim() || "An unexpected error occurred. Please try again."
    );
  }

  return "An unexpected error occurred. Please try again.";
}

export async function parseSSEStream(
  response: Response,
  onMessage: (data: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response body reader available");
  }

  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const messages = buffer.split("\n\n");

      buffer = messages.pop() || "";

      for (const message of messages) {
        if (!message.trim()) continue;

        const lines = message.split("\n");
        let data = "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            data += line.substring(6);
          }
        }

        if (data) {
          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              const errorMessage = formatErrorMessage(parsed.error);
              throw new Error(errorMessage);
            }

            if (
              parsed.content?.parts?.[0]?.functionCall ||
              parsed.content?.parts?.[0]?.functionResponse
            ) {
              continue;
            }

            if (typeof parsed === "string") {
              onMessage(parsed);
            } else if (parsed.text) {
              onMessage(parsed.text);
            } else if (parsed.content?.parts?.[0]?.text) {
              onMessage(parsed.content.parts[0].text);
            } else if (parsed.content && typeof parsed.content === "string") {
              onMessage(parsed.content);
            } else if (parsed.message) {
              onMessage(parsed.message);
            } else {
              onMessage(JSON.stringify(parsed));
            }
          } catch (parseError) {
            if (
              parseError instanceof Error &&
              parseError.message.includes("Rate limit")
            ) {
              throw parseError;
            }
            if (
              parseError instanceof Error &&
              parseError.message.includes("service")
            ) {
              throw parseError;
            }
            onMessage(data);
          }
        }
      }
    }

    if (buffer.trim()) {
      const lines = buffer.split("\n");
      let data = "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          data += line.substring(6);
        }
      }

      if (data) {
        try {
          const parsed = JSON.parse(data);

          if (parsed.error) {
            const errorMessage = formatErrorMessage(parsed.error);
            throw new Error(errorMessage);
          }

          if (
            parsed.content?.parts?.[0]?.functionCall ||
            parsed.content?.parts?.[0]?.functionResponse
          ) {
            return;
          }

          if (typeof parsed === "string") {
            onMessage(parsed);
          } else if (parsed.text) {
            onMessage(parsed.text);
          } else if (parsed.content?.parts?.[0]?.text) {
            onMessage(parsed.content.parts[0].text);
          } else if (parsed.content && typeof parsed.content === "string") {
            onMessage(parsed.content);
          } else if (parsed.message) {
            onMessage(parsed.message);
          }
        } catch (parseError) {
          if (
            parseError instanceof Error &&
            parseError.message.includes("Rate limit")
          ) {
            throw parseError;
          }
          if (
            parseError instanceof Error &&
            parseError.message.includes("service")
          ) {
            throw parseError;
          }
          onMessage(data);
        }
      }
    }
  } catch (error) {
    if (onError) {
      onError(error as Error);
    } else {
      throw error;
    }
  } finally {
    reader.releaseLock();
  }
}
