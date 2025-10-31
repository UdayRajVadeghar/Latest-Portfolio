import { ratelimit } from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

const AGENT_API_ENDPOINT = process.env.AGENT_API_ENDPOINT || "";
const AGENT_API_ENDPOINT_INTERACTION =
  process.env.AGENT_API_ENDPOINT_INTERACTION || "";
const BEARER_TOKEN = process.env.BEARER_TOKEN || "";

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "anonymous";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment and try again." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
          },
        }
      );
    }

    if (
      !AGENT_API_ENDPOINT ||
      !AGENT_API_ENDPOINT_INTERACTION ||
      !BEARER_TOKEN
    ) {
      console.error("Missing environment variables:", {
        AGENT_API_ENDPOINT: !!AGENT_API_ENDPOINT,
        AGENT_API_ENDPOINT_INTERACTION: !!AGENT_API_ENDPOINT_INTERACTION,
        BEARER_TOKEN: !!BEARER_TOKEN,
      });
      return NextResponse.json(
        { error: "Server configuration error: Missing API credentials" },
        { status: 500 }
      );
    }

    const { message, session_id } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.length > 1000) {
      return NextResponse.json(
        { error: "Message must be a string and cannot exceed 1000 characters" },
        { status: 400 }
      );
    }

    let sessionId = session_id;
    // console.log(
    //   "Received session_id:",
    //   sessionId || "(empty - will create new)"
    // );

    if (!sessionId) {
      console.log("Creating new session...");
      const sessionResponse = await fetch(AGENT_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse
          .text()
          .catch(() => "No error details");
        console.error("Session creation error:", {
          status: sessionResponse.status,
          statusText: sessionResponse.statusText,
          error: errorText,
        });
        throw new Error(
          `Failed to create session: ${sessionResponse.statusText} (${sessionResponse.status})`
        );
      }

      console.log("Session response status:", sessionResponse.status);
      console.log(
        "Session response headers:",
        Object.fromEntries(sessionResponse.headers.entries())
      );

      const sessionData = await sessionResponse.json();
      console.log(
        "Session response data:",
        JSON.stringify(sessionData, null, 2)
      );

      if (typeof sessionData === "string") {
        sessionId = sessionData;
      } else if (typeof sessionData === "object") {
        sessionId =
          sessionData.session_id || sessionData.sessionId || sessionData.id;
      }
      console.log("Extracted session ID:", sessionId, typeof sessionId);
    }

    if (!sessionId) {
      console.error("No session ID available after session creation");
      return NextResponse.json(
        { error: "Failed to establish session" },
        { status: 500 }
      );
    }

    const requestBody = {
      app_name: "rag-agent-app",
      user_id: "user",
      sessionId: sessionId,
      newMessage: {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
    };

    // console.log("Sending message with sessionId:", sessionId);

    const response = await fetch(AGENT_API_ENDPOINT_INTERACTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "No error details");
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      if (response.status === 404 && errorText.includes("Session not found")) {
        return NextResponse.json(
          { error: "Your session has expired. Please try again." },
          { status: 404 }
        );
      }

      let errorMessage = `Failed to send message: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          const err = errorJson.error;
          if (err.code === 429 || err.status === "RESOURCE_EXHAUSTED") {
            errorMessage =
              "Rate limit exceeded. Please wait a moment and try again.";
          } else if (err.message) {
            errorMessage = err.message;
          }
        }
      } catch {}

      throw new Error(errorMessage);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Session-Id": sessionId,
      },
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
