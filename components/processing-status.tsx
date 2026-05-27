"use client"

import { cn } from "@/lib/utils"

export type ProcessingStep = "idle" | "filtering" | "analyzing" | "generating" | "done" | "error"

const STEPS: { id: ProcessingStep; label: string; detail: string }[] = [
  { id: "filtering", label: "Filtering Drum Tracks", detail: "Separating percussion from mix using AI stem separation" },
  { id: "analyzing", label: "Analyzing Percussion", detail: "Detecting hit timing, velocity, and drum type classification" },
  { id: "generating", label: "Generating Notation", detail: "Rendering professional jazz-style sheet music" },
]

function stepIndex(step: ProcessingStep): number {
  return STEPS.findIndex((s) => s.id === step)
}

interface ProcessingStatusProps {
  step: ProcessingStep
}

export function ProcessingStatus({ step }: ProcessingStatusProps) {
  if (step === "idle") return null

  const currentIdx = stepIndex(step)

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4" role="status" aria-live="polite">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">AI Processing</p>
        {step === "done" && (
          <span className="flex items-center gap-1.5 text-xs font-mono text-primary">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
            </svg>
            Complete
          </span>
        )}
        {step === "error" && (
          <span className="text-xs font-mono text-destructive">Failed</span>
        )}
      </div>

      <div className="space-y-3">
        {STEPS.map((s, idx) => {
          const isActive = step === s.id
          const isDone = step === "done" || (currentIdx > idx && step !== "idle" && step !== "error")
          const isError = step === "error" && idx === currentIdx

          return (
            <div key={s.id} className="flex items-start gap-3">
              {/* Step icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-primary" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                ) : isError ? (
                  <div className="w-5 h-5 rounded-full border border-destructive flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-muted" />
                  </div>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </p>
                {isActive && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      {step !== "done" && step !== "error" && (
        <div className="h-0.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
            style={{
              width:
                step === "filtering" ? "33%" :
                step === "analyzing" ? "66%" :
                step === "generating" ? "90%" : "0%",
            }}
          />
        </div>
      )}
    </div>
  )
}
