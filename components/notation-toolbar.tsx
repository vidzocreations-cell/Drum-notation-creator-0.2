"use client"

import { cn } from "@/lib/utils"

interface NotationToolbarProps {
  onExport: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onPrint: () => void
  zoom: number
  disabled?: boolean
}

export function NotationToolbar({
  onExport,
  onZoomIn,
  onZoomOut,
  onPrint,
  zoom,
  disabled,
}: NotationToolbarProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-1">
        {/* Zoom controls */}
        <button
          onClick={onZoomOut}
          disabled={disabled || zoom <= 50}
          className={cn(
            "w-7 h-7 rounded flex items-center justify-center border border-border text-muted-foreground transition-colors",
            "hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
          )}
          aria-label="Zoom out"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M6.5 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM2 6.5a4.5 4.5 0 1 1 7.874 2.966l2.83 2.83a.75.75 0 1 1-1.06 1.06l-2.83-2.83A4.5 4.5 0 0 1 2 6.5ZM4.75 6.25a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" />
          </svg>
        </button>

        <span className="text-xs font-mono text-muted-foreground w-10 text-center">{zoom}%</span>

        <button
          onClick={onZoomIn}
          disabled={disabled || zoom >= 200}
          className={cn(
            "w-7 h-7 rounded flex items-center justify-center border border-border text-muted-foreground transition-colors",
            "hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
          )}
          aria-label="Zoom in"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M6.5 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM2 6.5a4.5 4.5 0 1 1 7.874 2.966l2.83 2.83a.75.75 0 1 1-1.06 1.06l-2.83-2.83A4.5 4.5 0 0 1 2 6.5ZM6.25 4.75a.75.75 0 0 0-1.5 0V6H3.5a.75.75 0 0 0 0 1.5H4.75v1.25a.75.75 0 1 0 1.5 0V7.5h1.25a.75.75 0 0 0 0-1.5H6.25V4.75Z" />
          </svg>
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* View toggles */}
        {["Jazz", "Standard", "Simplified"].map((style) => (
          <button
            key={style}
            disabled={disabled}
            className={cn(
              "px-2 py-1 rounded text-xs font-mono border transition-colors",
              style === "Jazz"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              disabled && "opacity-30 pointer-events-none"
            )}
          >
            {style}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrint}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs font-mono text-muted-foreground transition-colors",
            "hover:border-primary/50 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
          )}
          aria-label="Print notation"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M5 1a2 2 0 0 0-2 2v1H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5Zm6 1.5H5a.5.5 0 0 0-.5.5v1h7V3a.5.5 0 0 0-.5-.5ZM4.5 12v-.5H2a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2.5V12h.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h.5Zm.5 1.5h6v1.5h-6V13.5Z" />
          </svg>
          Print
        </button>

        <button
          onClick={onExport}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-mono font-semibold transition-opacity",
            "hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none"
          )}
          aria-label="Export as PDF"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .75.75v5.19l1.72-1.72a.75.75 0 1 1 1.06 1.06L8 9.81 4.47 6.28a.75.75 0 0 1 1.06-1.06l1.72 1.72V1.75A.75.75 0 0 1 8 1ZM1.75 13a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H1.75Z" />
          </svg>
          Export PDF
        </button>
      </div>
    </div>
  )
}
