export function setSession(key, value, ttlMs = 5 * 60 * 1000) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const expiry = Date.now() + ttlMs;
    const sessionData = {
      value,
      expiry,
    };
    localStorage.setItem(key, JSON.stringify(sessionData));
  } catch (error) {
    console.error(`Failed to set session for key "${key}":`, error);
  }
}

export function getSession(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    const sessionData = JSON.parse(item);

    if (!sessionData || typeof sessionData.expiry !== "number") {
      localStorage.removeItem(key);
      return null;
    }

    if (Date.now() > sessionData.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return sessionData.value;
  } catch (error) {
    console.error(`Failed to parse session for key "${key}":`, error);
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    return null;
  }
}

export function touchSession(key, ttlMs = 5 * 60 * 1000) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return;
    }

    const sessionData = JSON.parse(item);

    if (!sessionData || typeof sessionData.expiry !== "number") {
      return;
    }

    sessionData.expiry = Date.now() + ttlMs;
    localStorage.setItem(key, JSON.stringify(sessionData));
  } catch (error) {
    console.error(`Failed to touch session for key "${key}":`, error);
  }
}

export function clearSession(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear session for key "${key}":`, error);
  }
}
