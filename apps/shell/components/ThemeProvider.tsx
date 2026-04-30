import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
	mode: ThemeMode;
	resolved: "light" | "dark";
	setMode: (next: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_COOKIE_NAME = "rift-theme";
const THEME_STORAGE_KEY = "rift-theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

function isThemeMode(value: unknown): value is ThemeMode {
	return value === "system" || value === "light" || value === "dark";
}

function readSystemPrefersDark(): boolean {
	if (typeof globalThis.matchMedia !== "function") {
		return false;
	}
	return globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
	if (mode === "system") {
		return readSystemPrefersDark() ? "dark" : "light";
	}
	return mode;
}

function persistTheme(mode: ThemeMode): void {
	try {
		globalThis.localStorage?.setItem(THEME_STORAGE_KEY, mode);
	} catch {
		/* ignore */
	}
	document.cookie = `${THEME_COOKIE_NAME}=${mode}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`;
}

function applyTheme(resolved: "light" | "dark"): void {
	const root = document.documentElement;
	root.classList.toggle("dark", resolved === "dark");
	root.style.colorScheme = resolved;
}

/**
 * Theme provider. SSR-safe: takes an `initialMode` resolved server-side from
 * the `rift-theme` cookie so the first render matches the no-flash script
 * injected in `+Head.tsx`.
 *
 * Persists the user's choice in both a cookie (so SSR sees it) and
 * localStorage (so client navigations don't depend on the cookie). In
 * `"system"` mode it listens to `matchMedia("(prefers-color-scheme: dark)")`
 * and switches the resolved class live.
 */
export function ThemeProvider({
	initialMode = "system",
	children,
}: {
	initialMode?: ThemeMode;
	children: ReactNode;
}): JSX.Element {
	const [mode, setModeState] = useState<ThemeMode>(initialMode);
	const [resolved, setResolved] = useState<"light" | "dark">(() => resolveTheme(initialMode));

	useEffect(() => {
		const next = resolveTheme(mode);
		setResolved(next);
		applyTheme(next);
		if (mode !== "system") {
			return () => {
				// no cleanup needed for non-system modes
			};
		}
		const mq = globalThis.matchMedia("(prefers-color-scheme: dark)");
		const onChange = (): void => {
			const r = readSystemPrefersDark() ? "dark" : "light";
			setResolved(r);
			applyTheme(r);
		};
		mq.addEventListener("change", onChange);
		return () => {
			mq.removeEventListener("change", onChange);
		};
	}, [mode]);

	const setMode = useCallback((next: ThemeMode): void => {
		setModeState(next);
		persistTheme(next);
	}, []);

	const value = useMemo<ThemeContextValue>(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used inside <ThemeProvider>");
	}
	return ctx;
}

export { isThemeMode };
