import { Box, Terminal, Cloud, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Box,
    title: "Containerized Deployments",
    body: "Build and run applications inside isolated Docker containers.",
  },
  {
    icon: Terminal,
    title: "Real-time Logs",
    body: "Watch builds and deployments as they happen through real-time logs.",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    body: "Run workloads on scalable AWS infrastructure.",
  },
  {
    icon: RefreshCw,
    title: "Automatic Deployments",
    body: "Move from source code to a running deployment through a streamlined workflow.",
  },
];

export function Features() {
  return (
    <section className="border-t border-ly-border bg-ly-surface">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-md ly-heading text-3xl text-ly-ink sm:text-4xl">
          Everything you need to ship.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-ly-border bg-ly-border sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-background p-6 ly-card">
              <Icon className="h-5 w-5 text-ly-orange" />
              <h3 className="mt-4 ly-body font-medium text-ly-ink">{title}</h3>
              <p className="mt-2 ly-body-sm leading-relaxed text-ly-ink-soft">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}