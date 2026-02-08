"use client";

import { ReactNode } from "react";

// No animation wrapper — instant page switches for maximum responsiveness.
// Per-page content animations handle the visual polish.
export function PageTransition({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
