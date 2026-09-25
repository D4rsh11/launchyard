"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const links = [
  { label: "Product", href: "#product" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "GitHub", href: "https://github.com/D4rsh11/launchyard" },
];

function Mark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 1.5c2.4 2.6 3.6 5.6 3.6 9 0 2-.5 3.7-1.3 5.2l-2.3 2.3-2.3-2.3C6.9 14.2 6.4 12.5 6.4 10.5c0-3.4 1.2-6.4 3.6-9Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="10" cy="8.5" r="1.4" fill="var(--ly-orange)" />
      <path
        d="M7 15.5 4.8 19M13 15.5l2.2 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? "border-b border-ly-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }
      `}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-ly-ink transition-opacity hover:opacity-80"
        >
          <Mark />
          <span className="font-mono text-[15px] font-medium tracking-tight">
            launchyard
          </span>
        </Link>

        {/* Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="ly-body-sm text-ly-ink-soft transition-colors hover:text-ly-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Login */}
          <Link
            href="/login"
            className="hidden ly-body-sm text-ly-ink-soft transition-colors hover:text-ly-ink sm:inline"
          >
            Log in
          </Link>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="
              rounded-md p-2
              text-ly-ink-soft
              transition-colors
              hover:bg-ly-surface
              hover:text-ly-ink
              ly-focus
            "
            aria-label={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Get Started - Speakeasy style: obsidian background, white text, 4px radius */}
          <Link href="/deploy" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-base font-medium text-black transition-colors hover:bg-white/90 ly-button">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}