// Standalone dev: no header. The shell's `+Layout.tsx` provides the canonical
// nav/header once mfe-player is absorbed into the shell (Phase E).
import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
