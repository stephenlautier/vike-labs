import { enhance } from "@universal-middleware/core";
import type { UniversalMiddleware } from "@universal-middleware/core";

const THEME_COOKIE = "rift-theme";
const VALID_THEMES = ["system", "light", "dark"] as const;
type ThemeMode = (typeof VALID_THEMES)[number];

function parseCookie(header: string | null, name: string): string | null {
	if (!header) {
		return null;
	}
	for (const part of header.split(";")) {
		const [k, ...v] = part.trim().split("=");
		if (k === name) {
			return decodeURIComponent(v.join("=") ?? "");
		}
	}
	return null;
}

function isThemeMode(value: string | null): value is ThemeMode {
	return value !== null && (VALID_THEMES as readonly string[]).includes(value);
}

/**
 * Reads the `rift-theme` cookie and exposes it as `pageContext.theme` so the
 * SSR-rendered `<html>` tag and the inline no-flash script in `+Head.tsx`
 * stay in sync with the user's saved preference.
 */
export const themeMiddleware: UniversalMiddleware = enhance(
	(request, context) => {
		const raw = parseCookie(request.headers.get("cookie"), THEME_COOKIE);
		const theme: ThemeMode = isThemeMode(raw) ? raw : "system";
		return { ...context, theme };
	},
	{
		name: "rift:theme-middleware",
		immutable: false,
	},
);
