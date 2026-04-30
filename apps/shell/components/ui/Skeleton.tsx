import type { HTMLAttributes, JSX } from "react";

/**
 * Minimal shadcn-style `Skeleton` primitive. Use as a placeholder while data
 * is loading client-side (the horizontal MFEs are SSR'd via `+data.ts` so
 * they don't need this; the player MFE and any future client-fetched panels
 * do).
 */
export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
	return <div className={`animate-pulse rounded-md bg-muted ${className}`} {...props} />;
}
