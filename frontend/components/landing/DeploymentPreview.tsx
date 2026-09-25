"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const logLines = [
  "Building application...",
  "Creating Docker image...",
  "Uploading artifacts...",
  "Starting container...",
  "Deployment successful ✓",
];

const buildSteps = [
  "Dependencies installed",
  "Application built",
  "Docker image created",
  "Container deployed",
];

export function DeploymentPreview() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (visible >= logLines.length) return;

    const t = setTimeout(() => {
      setVisible((v) => v + 1);
    }, 650);

    return () => clearTimeout(t);
  }, [visible]);

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-ly-border
          bg-background
          shadow-[0_1px_2px_rgba(14,17,22,0.04)]
          transition-colors
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-ly-border
            px-5
            py-4
          "
        >
          <div>
            <p className="text-sm font-medium text-ly-ink">
              Production Deployment
            </p>

            <p className="mt-0.5 font-mono text-xs text-ly-ink-soft">
              launchyard-demo
            </p>
          </div>

          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-ly-orange-soft
              px-2.5
              py-1
              font-mono
              text-xs
              text-ly-orange
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ly-orange" />

            Deployment successful
          </span>
        </div>

        {/* Deployment information */}
        <div className="grid gap-6 px-5 py-5 sm:grid-cols-2">
          {/* Project details */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-ly-border pb-2">
              <span className="text-ly-ink-soft">
                Project
              </span>

              <span className="text-ly-ink">
                launchyard-demo
              </span>
            </div>

            <div className="flex justify-between border-b border-ly-border pb-2">
              <span className="text-ly-ink-soft">
                Commit
              </span>

              <span className="text-ly-ink">
                a81f32c
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-ly-ink-soft">
                Live URL
              </span>

              <a
                href="#"
                className="text-ly-blue transition-opacity hover:opacity-70"
              >
                launchyard-demo.launchyard.app
              </a>
            </div>
          </div>

          {/* Build steps */}
          <ul className="space-y-2 text-sm">
            {buildSteps.map((step) => (
              <li
                key={step}
                className="flex items-center gap-2 text-ly-ink-soft"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-ly-blue" />

                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Terminal */}
        <div className="border-t border-ly-border bg-neutral-950 px-5 py-4">
          <pre className="space-y-1 font-mono text-xs leading-relaxed text-white/80">
            {logLines.slice(0, visible).map((line, i) => (
              <div
                key={line}
                className={
                  i === visible - 1
                    ? "animate-pulse"
                    : ""
                }
              >
                <span className="text-white/40">
                  &gt;{" "}
                </span>

                {line}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </section>
  );
}