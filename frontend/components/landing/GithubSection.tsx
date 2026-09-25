import { ArrowUpRight, GitFork, Star } from "lucide-react";

export function GithubSection() {
  return (
    <section className="border-t border-ly-border bg-ly-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ly-ink sm:text-3xl">
            Built in the open.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ly-ink-soft sm:text-base">
            Launchyard is an open-source project built to explore how modern
            deployment platforms work under the hood.
          </p>
          <a
            href="https://github.com/D4rsh11/launchyard"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ly-ink hover:text-ly-blue"
          >
            View source on GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <a
          href="https://github.com/D4rsh11/launchyard"
          className="block rounded-xl border border-ly-border bg-background p-6 transition-colors hover:border-ly-blue/40"
        >
          <p className="font-mono text-sm text-ly-ink">D4rsh11 / launchyard</p>
          <p className="mt-2 text-sm text-ly-ink-soft">
            Container-based deployment platform that builds applications from
            Git repositories and serves the generated artifacts through URLs.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-ly-border px-2.5 py-1 text-ly-ink-soft">
              TypeScript
            </span>
            <span className="rounded-full border border-ly-border px-2.5 py-1 text-ly-ink-soft">
              Docker
            </span>
            <span className="rounded-full border border-ly-border px-2.5 py-1 text-ly-ink-soft">
              AWS
            </span>
          </div>
          <div className="mt-5 flex items-center gap-4 border-t border-ly-border pt-4 text-xs text-ly-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5" /> Star
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" /> Fork
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
