import { Monitor, Moon, Sun } from "lucide-react";
import type { JSX } from "react";
import { useCallback } from "react";

import { useTheme } from "./ThemeProvider";
import type { ThemeMode } from "./ThemeProvider";

const OPTIONS: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
	{ mode: "system", label: "System", Icon: Monitor },
	{ mode: "light", label: "Light", Icon: Sun },
	{ mode: "dark", label: "Dark", Icon: Moon },
];

function isThemeMode(value: string | null): value is ThemeMode {
	return value === "system" || value === "light" || value === "dark";
}

/**
 * Three-way segmented control: System / Light / Dark. Compact enough to live
 * in the Nav next to the user menu. Skips the dropdown so it works without
 * any radix/popover dependency.
 */
export function ThemeSwitcher(): JSX.Element {
	const { mode, setMode } = useTheme();
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>): void => {
			const next = event.currentTarget.dataset.mode ?? null;
			if (isThemeMode(next)) {
				setMode(next);
			}
		},
		[setMode],
	);
	return (
		<div
			role="radiogroup"
			aria-label="Theme"
			className="inline-flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5">
			{OPTIONS.map(({ mode: optionMode, label, Icon }) => {
				const active = mode === optionMode;
				return (
					<button
						key={optionMode}
						type="button"
						role="radio"
						aria-checked={active}
						aria-label={label}
						title={label}
						data-mode={optionMode}
						onClick={handleClick}
						className={`inline-flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
							active
								? "bg-accent text-accent-foreground"
								: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
						}`}>
						<Icon className="h-3.5 w-3.5" aria-hidden="true" />
					</button>
				);
			})}
		</div>
	);
}
