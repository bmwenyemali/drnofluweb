"use client";

import { ReactNode } from "react";
import { LocaleProvider } from "@/lib/i18n";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper for all client-side providers
 */
export function Providers({ children }: ProvidersProps) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
