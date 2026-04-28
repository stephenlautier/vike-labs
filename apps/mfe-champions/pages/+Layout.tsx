import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <a href="/" className="font-bold text-lg tracking-tight">
            Champions
          </a>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
