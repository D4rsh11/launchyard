import { ArrowRight, ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-ly-border">
      <svg
        viewBox="0 0 400 200"
        className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-[0.06]"
        aria-hidden="true"
      >
        <path
          d="M200 20c20 26 30 54 30 84 0 30-10 68-30 116-20-48-30-86-30-116 0-30 10-58 30-84Z"
          fill="var(--ly-ink)"
        />
      </svg>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-ly-ink sm:text-3xl">
          Ready to launch?
        </h2>
        <p className="mt-3 text-sm text-ly-ink-soft sm:text-base">
          Ship your next project without worrying about the infrastructure
          behind it.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#product"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Start Deploying <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/D4rsh11/launchyard"
            className="inline-flex items-center gap-2 rounded-md border border-ly-border px-5 py-2.5 text-sm font-medium text-ly-ink transition-colors hover:bg-ly-surface"
          >
            View GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
