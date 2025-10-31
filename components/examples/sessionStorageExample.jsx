import useSessionStorage from "@/lib/session/useSessionStorage";
import React, { useState } from "react";

export default function SessionStorageExample() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const {
    value: session,
    save,
    clear,
    touchOnSuccess,
  } = useSessionStorage(
    "user_session",
    null,
    5 * 60 * 1000
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "user@example.com",
          password: "password123",
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      save({
        userId: data.userId,
        username: data.username,
        sessionId: data.sessionId,
        loginTime: Date.now(),
      });

      setMessage("Login successful! Redirecting...");

    } catch (err) {
      setError(err.message);
      clear();
    } finally {
      setLoading(false);
    }
  };

  const handleCriticalActionWithFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await touchOnSuccess(async () => {
        const res = await fetch("/api/critical", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": session?.sessionId,
          },
          body: JSON.stringify({
            action: "important_operation",
            data: { foo: "bar" },
          }),
        });

        if (!res.ok) {
          throw new Error(`API failed with status ${res.status}`);
        }

        return res.json();
      });

      setMessage("Critical action succeeded! Session extended.");
      console.log("API Response:", response);
    } catch (err) {
      setError("Critical action failed. Session cleared. Please login again.");
      console.error("API Error:", err);

    } finally {
      setLoading(false);
    }
  };

  const handleCriticalActionWithAxios = async () => {
    setLoading(true);
    setError(null);

    try {

      setMessage("(Uncomment axios code to test)");
    } catch (err) {
      setError("Critical action failed. Session cleared. Please login again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clear();
    setMessage("Logged out successfully");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Session Storage Example</h1>

      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          background: session ? "#d4edda" : "#f8d7da",
          border: `1px solid ${session ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "4px",
        }}
      >
        <strong>Session Status:</strong> {session ? "Active" : "Not logged in"}
        {session && (
          <div style={{ marginTop: "10px", fontSize: "14px" }}>
            <div>User: {session.username}</div>
            <div>Session ID: {session.sessionId}</div>
            <div>
              Login Time: {new Date(session.loginTime).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            background: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            color: "#721c24",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            background: "#d1ecf1",
            border: "1px solid #bee5eb",
            borderRadius: "4px",
            color: "#0c5460",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {!session ? (
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            {loading ? "Logging in..." : "Login (Demo)"}
          </button>
        ) : (
          <>
            <button
              onClick={handleCriticalActionWithFetch}
              disabled={loading}
              style={{ padding: "10px", cursor: "pointer" }}
            >
              {loading ? "Processing..." : "Critical Action (Fetch)"}
            </button>

            <button
              onClick={handleCriticalActionWithAxios}
              disabled={loading}
              style={{ padding: "10px", cursor: "pointer" }}
            >
              {loading ? "Processing..." : "Critical Action (Axios - Demo)"}
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        <h3>How It Works:</h3>
        <ul>
          <li>
            <strong>Login:</strong> On success, saves session with 5-minute TTL
          </li>
          <li>
            <strong>Critical Actions:</strong> Uses <code>touchOnSuccess</code>{" "}
            wrapper:
            <ul>
              <li>✅ On success (2xx): Extends session expiry by 5 minutes</li>
              <li>❌ On failure (non-2xx/error): Clears session immediately</li>
            </ul>
          </li>
          <li>
            <strong>No Auto-Touch:</strong> Session is NOT refreshed on
            mouse/keyboard events
          </li>
          <li>
            <strong>Cross-Tab Sync:</strong> Changes sync across browser tabs
            automatically
          </li>
        </ul>

        <h3>⚠️ Security Reminder:</h3>
        <p
          style={{
            color: "#856404",
            background: "#fff3cd",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          Do NOT store sensitive auth tokens in localStorage. Use httpOnly
          cookies for real authentication. Only store non-sensitive session info
          or short-lived session identifiers.
        </p>
      </div>
    </div>
  );
}

export function useApiWithSession() {
  const { touchOnSuccess } = useSessionStorage("user_session");

  const callApi = async (url, options = {}) => {
    return touchOnSuccess(async () => {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
  };

  return { callApi };
}

export function useMultiStepProcess() {
  const { touchOnSuccess } = useSessionStorage("user_session");

  const executeMultiStep = async () => {
    try {
      const step1 = await touchOnSuccess(() =>
        fetch("/api/step1").then((r) => r.json())
      );
      const step2 = await touchOnSuccess(() =>
        fetch("/api/step2").then((r) => r.json())
      );
      const step3 = await touchOnSuccess(() =>
        fetch("/api/step3").then((r) => r.json())
      );

      return { step1, step2, step3 };
    } catch (error) {
      console.error("Multi-step process failed:", error);
      throw error;
    }
  };

  return { executeMultiStep };
}
