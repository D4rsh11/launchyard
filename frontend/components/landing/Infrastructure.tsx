function ArchDiagram() {
  const nodes = [
    { y: 20, label: "Developer" },
    { y: 100, label: "Launchyard API" },
    { y: 180, label: "Docker Build" },
    { y: 260, label: "S3" },
    { y: 340, label: "AWS ECS Fargate" },
    { y: 420, label: "Running Application" },
  ];

  return (
    <svg viewBox="0 0 640 460" className="w-full max-w-md" aria-hidden="true">
      {/* main flow line */}
      <line
        x1="180"
        y1="34"
        x2="180"
        y2="406"
        stroke="var(--ly-border)"
        strokeWidth="1.5"
      />
      <g className="ly-flow-dash">
        <line
          x1="180"
          y1="34"
          x2="180"
          y2="406"
          stroke="var(--ly-blue)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
      </g>

      {nodes.map((n) => (
        <g key={n.label}>
          <rect
            x="60"
            y={n.y}
            width="240"
            height="34"
            rx="6"
            fill="var(--background)"
            stroke="var(--ly-border)"
          />
          <text
            x="180"
            y={n.y + 21}
            textAnchor="middle"
            fontSize="12"
            fontFamily="var(--font-ibm-plex-mono)"
            fill="var(--ly-ink)"
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* branch to log pipeline */}
      <path
        d="M300 197 H400"
        stroke="var(--ly-orange)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M480 214 V 60 H300"
        stroke="var(--ly-orange)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 6"
        markerEnd="url(#arrow)"
      />

      <rect x="400" y="197" width="150" height="34" rx="6" fill="var(--ly-orange-soft)" stroke="var(--ly-orange)" />
      <text x="475" y="218" textAnchor="middle" fontSize="11.5" fontFamily="var(--font-ibm-plex-mono)" fill="var(--ly-ink)">
        Valkey / Redis
      </text>

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--ly-orange)" />
        </marker>
      </defs>

      <text x="480" y="46" textAnchor="middle" fontSize="10.5" fontFamily="var(--font-ibm-plex-mono)" fill="var(--ly-ink-soft)">
        Socket.IO (live logs)
      </text>
    </svg>
  );
}

export function Infrastructure() {
  return (
    <section id="infrastructure" className="border-t border-ly-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ly-ink sm:text-3xl">
            Built on real infrastructure.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ly-ink-soft sm:text-base">
            Launchyard orchestrates the infrastructure behind every
            deployment so developers can focus on shipping code.
          </p>
        </div>
        <div className="flex justify-center">
          <ArchDiagram />
        </div>
      </div>
    </section>
  );
}
