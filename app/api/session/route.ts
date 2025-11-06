import { ratelimit } from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AGENT_API_ENDPOINT = process.env.AGENT_API_ENDPOINT || "";
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

    if (!AGENT_API_ENDPOINT || !BEARER_TOKEN) {
      console.error("Missing environment variables:", {
        AGENT_API_ENDPOINT: !!AGENT_API_ENDPOINT,
        BEARER_TOKEN: !!BEARER_TOKEN,
      });
      return NextResponse.json(
        { error: "Server configuration error: Missing API credentials" },
        { status: 500 }
      );
    }

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
    console.log("Session response data:", JSON.stringify(sessionData, null, 2));

    let sessionId: string | undefined;
    if (typeof sessionData === "string") {
      sessionId = sessionData;
    } else if (typeof sessionData === "object") {
      sessionId =
        sessionData.session_id || sessionData.sessionId || sessionData.id;
    }
    console.log("Extracted session ID:", sessionId, typeof sessionId);

    if (!sessionId) {
      console.error("No session ID available after session creation");
      return NextResponse.json(
        { error: "Failed to establish session" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { session_id: sessionId },
      {
        status: 200,
        headers: {
          "X-Session-Id": sessionId,
        },
      }
    );
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
