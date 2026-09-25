const links = [
  { label: "Product", href: "#product" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "GitHub", href: "https://github.com/D4rsh11/launchyard" },
  { label: "Documentation", href: "#" },
  { label: "Login", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-ly-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-sm font-medium text-ly-ink">
            launchyard
          </p>
          <p className="mt-1 text-sm text-ly-ink-soft">
            Ship code. Launch fast.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm text-ly-ink-soft transition-colors hover:text-ly-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ly-border px-6 py-5">
        <p className="mx-auto max-w-6xl text-xs text-ly-ink-soft">
          © 2026 Launchyard
        </p>
      </div>
    </footer>
  );
}
