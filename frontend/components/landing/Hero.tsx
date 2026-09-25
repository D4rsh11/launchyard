import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="product"
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Rocket launch background */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src="/launchyardbg.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="ly-grid-bg absolute inset-0" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-28 text-center sm:pt-36">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs text-white/70 backdrop-blur-sm ly-caption font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Ship code. Launch fast.
        </span>

        <h1 className="mt-6 ly-display text-white sm:text-[clamp(3rem,8vw,5.5rem)]">
          Deploy your code.
          <br />
          Launch it into production.
        </h1>

        <p className="mt-6 max-w-xl text-balance ly-body text-white/65 sm:text-base">
          Launchyard is a container-based deployment platform that takes your
          code from repository to a running application without the
          infrastructure hassle.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/deploy"
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-base font-medium text-black transition-colors hover:bg-white/90 ly-button"
          >
            Start Deploying
            <ArrowRight className="h-5 w-5" />
          </Link>

          <a
            href="https://github.com/D4rsh11/launchyard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/20 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 ly-button"
          >
            View on GitHub
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}