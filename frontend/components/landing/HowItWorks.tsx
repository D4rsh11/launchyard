import { GitBranch, Container, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: GitBranch,
    title: "Connect your code",
    body: "Connect a repository and select the application you want to deploy.",
  },
  {
    n: "02",
    icon: Container,
    title: "Build your container",
    body: "Launchyard builds your application into an isolated Docker container.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Launch",
    body: "The container is deployed to cloud infrastructure and made available through a production URL.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-ly-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-md ly-heading text-3xl text-ly-ink sm:text-4xl">
          From code to production in a few steps.
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map(({ n, icon: Icon, title, body }) => (
            <div key={n}>
              <div className="flex items-center gap-3">
                <span className="ly-caption text-ly-ink-soft">{n}</span>
                <div className="h-px flex-1 bg-ly-border" />
                <Icon className="h-4 w-4 text-ly-orange" />
              </div>
              <h3 className="mt-4 ly-body font-medium text-ly-ink">
                {title}
              </h3>
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