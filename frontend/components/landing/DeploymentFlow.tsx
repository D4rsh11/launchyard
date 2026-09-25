const stages = [
  { label: "GitHub", detail: "Repository" },
  { label: "Build Image", detail: "Dependencies + build" },
  { label: "Docker Container", detail: "Isolated runtime" },
  { label: "AWS ECS", detail: "Fargate task" },
  { label: "Production", detail: "Live URL" },
];

export function DeploymentFlow() {
  return (
    <section className="border-t border-ly-border bg-ly-surface transition-colors">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex flex-1 items-center gap-3">
              <div className="w-full rounded-lg border border-ly-border bg-background p-4 ly-card">
                <p className="ly-caption text-ly-ink">
                  {stage.label}
                </p>

                <p className="mt-1 ly-body-sm text-ly-ink-soft">
                  {stage.detail}
                </p>
              </div>

              {i < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden shrink-0 font-mono text-ly-border md:block"
                >
                  →
                </span>
              )}

              {i < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className="block shrink-0 self-center font-mono text-ly-border md:hidden"
                >
                  ↓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}