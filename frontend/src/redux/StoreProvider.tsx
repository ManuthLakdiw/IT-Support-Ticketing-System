"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { hydrateFromCookie } from "./features/authSlice";
import type { AuthUser } from "./features/authSlice";

function readUserFromCookie(): AuthUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_info="));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      store.dispatch(hydrateFromCookie(readUserFromCookie()));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
