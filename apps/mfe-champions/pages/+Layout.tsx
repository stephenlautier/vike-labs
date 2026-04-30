// Standalone dev: no header. The shell's `+Layout.tsx` provides the canonical
// nav/header once these pages are absorbed into the shell (Phase C/D).
import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
