"use client"

import { useState, useRef, useCallback } from "react"
import { UploadZone } from "@/components/upload-zone"
import { ProcessingStatus, type ProcessingStep } from "@/components/processing-status"
import { RecentSessions, type Session } from "@/components/recent-sessions"
import { DrumNotationDisplay } from "@/components/drum-notation-display"
import { NotationToolbar } from "@/components/notation-toolbar"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [step, setStep] = useState<ProcessingStep>("idle")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [zoom, setZoom] = useState(100)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isProcessing = step === "filtering" || step === "analyzing" || step === "generating"
  const isDone = step === "done"

  const runProcessing = useCallback(() => {
    setStep("filtering")
    timerRef.current = setTimeout(() => {
      setStep("analyzing")
      timerRef.current = setTimeout(() => {
        setStep("generating")
        timerRef.current = setTimeout(() => {
          setStep("done")
        }, 2000)
      }, 2200)
    }, 2000)
  }, [])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setYoutubeUrl("")
    setStep("idle")
  }

  const handleConvert = () => {
    if (!youtubeUrl.trim() && !selectedFile) return
    setStep("idle")
    setTimeout(runProcessing, 100)
  }

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStep("idle")
    setSelectedFile(null)
    setYoutubeUrl("")
    setActiveSession(null)
  }

  const handleSessionSelect = (session: Session) => {
    setActiveSession(session)
    if (session.status === "done") setStep("done")
    else setStep("idle")
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 h-14 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary" aria-hidden="true">
                <circle cx="4" cy="14" r="2.5" />
                <circle cx="10" cy="11" r="2.5" />
                <circle cx="16" cy="8" r="2.5" />
                <path d="M6.5 14V8M12.5 11V5M4 11.5V4M10 8.5V2M16 5.5V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mono font-bold text-foreground tracking-tight text-sm">DrumScript</span>
            <span className="hidden sm:inline text-xs font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">
              AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 ml-4">
            {["Dashboard", "Library", "Templates", "Settings"].map((nav) => (
              <button
                key={nav}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-mono transition-colors",
                  nav === "Dashboard"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                {nav}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDone && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Notation ready
            </span>
          )}
          <button
            onClick={handleReset}
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            New Session
          </button>
          <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-mono text-muted-foreground">
            JD
          </div>
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside
          className={cn(
            "flex-shrink-0 border-r border-border bg-sidebar transition-all duration-300 overflow-hidden",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          <div className="flex flex-col h-full p-4 w-64">
            <RecentSessions
              onSelect={handleSessionSelect}
              activeId={activeSession?.id}
            />

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Notation Key
              </p>
              <div className="space-y-1.5">
                {[
                  { symbol: "✕", label: "Hi-Hat / Ride" },
                  { symbol: "●", label: "Snare / Tom" },
                  { symbol: "◆", label: "Bass Drum" },
                ].map(({ symbol, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-primary font-mono text-xs w-4 text-center">{symbol}</span>
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Center / Main Content ─────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Toggle sidebar button */}
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-4 h-10 bg-border hover:bg-primary/20 transition-colors rounded-r flex items-center justify-center"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            style={{ marginLeft: sidebarOpen ? "256px" : "0" }}
          >
            <svg
              viewBox="0 0 8 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("w-2.5 h-3 text-muted-foreground transition-transform", sidebarOpen ? "" : "rotate-180")}
              aria-hidden="true"
            >
              <path d="M6 1 2 7l4 6" />
            </svg>
          </button>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Title row */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold text-balance leading-tight">
                  {activeSession ? activeSession.title : "New Conversion"}
                </h1>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {activeSession
                    ? `${activeSession.style ?? "—"}  ·  ${activeSession.bpm ? `♩${activeSession.bpm}` : "—"}`
                    : "Upload a track or paste a YouTube URL to get started"}
                </p>
              </div>
              {isDone && activeSession && (
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded px-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {activeSession.status === "done" ? "Completed" : "Just processed"}
                </div>
              )}
            </div>

            {/* Input area (only when not showing result) */}
            {!isDone && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File upload */}
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Upload Audio / Video
                  </p>
                  <UploadZone onFileSelect={handleFileSelect} disabled={isProcessing} />
                  {selectedFile && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-muted border border-border text-xs">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true">
                        <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z" />
                      </svg>
                      <span className="text-foreground font-medium truncate">{selectedFile.name}</span>
                      <span className="text-muted-foreground ml-auto flex-shrink-0">
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  )}
                </div>

                {/* YouTube URL */}
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    YouTube URL
                  </p>
                  <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center gap-2 p-2 rounded bg-muted border border-input">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-400 flex-shrink-0" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.75 12 12 0 0 0-16.21 6.07 12 12 0 0 0 3.35 13.36 12 12 0 0 0 13.97.88 12 12 0 0 0 5.27-12.41 4.83 4.83 0 0 1-2.61-5.15zM10 15V9l5 3-5 3z" />
                      </svg>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => {
                          setYoutubeUrl(e.target.value)
                          if (e.target.value) setSelectedFile(null)
                        }}
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono"
                        disabled={isProcessing}
                        aria-label="YouTube video URL"
                      />
                      {youtubeUrl && (
                        <button
                          onClick={() => setYoutubeUrl("")}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Clear URL"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleConvert}
                      disabled={isProcessing || (!youtubeUrl.trim() && !selectedFile)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-2.5 rounded font-mono font-semibold text-sm transition-all",
                        "bg-primary text-primary-foreground hover:opacity-90",
                        "disabled:opacity-30 disabled:pointer-events-none"
                      )}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z" />
                          </svg>
                          Convert to Notation
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                      AI will isolate the drum track and generate jazz notation
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Processing status */}
            <ProcessingStatus step={step} />

            {/* Notation display */}
            {(isDone || activeSession?.status === "done") && (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Notation header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      Jazz Notation — Full Score
                    </span>
                    {activeSession?.bpm && (
                      <span className="text-xs font-mono text-primary/70 border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded">
                        ♩ = {activeSession.bpm}
                      </span>
                    )}
                  </div>
                  <NotationToolbar
                    zoom={zoom}
                    onZoomIn={() => setZoom((z) => Math.min(200, z + 25))}
                    onZoomOut={() => setZoom((z) => Math.max(50, z - 25))}
                    onExport={() => alert("Exporting PDF…")}
                    onPrint={() => window.print()}
                    disabled={false}
                  />
                </div>

                {/* Notation canvas area */}
                <div className="overflow-x-auto p-4 bg-[#0d0d0d]">
                  <div
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left", minWidth: "600px" }}
                  >
                    <DrumNotationDisplay active={isProcessing} />
                    {/* Measure 2 repeat */}
                    <div className="mt-2">
                      <DrumNotationDisplay active={false} />
                    </div>
                  </div>
                </div>

                {/* Footer stats */}
                <div className="flex items-center gap-6 px-4 py-2.5 border-t border-border bg-card/50">
                  {[
                    { label: "Measures", value: "32" },
                    { label: "Time", value: activeSession?.style?.includes("5/4") ? "5/4" : "4/4" },
                    { label: "Swing", value: "67%" },
                    { label: "Accuracy", value: "94%" },
                    { label: "Style", value: activeSession?.style ?? "Jazz Swing" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
                      <span className="text-xs font-mono text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {step === "idle" && !activeSession && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full border border-border bg-muted flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-muted-foreground" aria-hidden="true">
                    <circle cx="5" cy="17" r="2" />
                    <circle cx="11" cy="14" r="2" />
                    <circle cx="17" cy="11" r="2" />
                    <path strokeLinecap="round" d="M7 17V11M13 14V8M5 14.5V7M11 11.5V4M17 8.5V2" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-muted-foreground text-balance max-w-xs">
                  Upload a track or paste a YouTube link to generate drum notation
                </p>
                <p className="text-xs text-muted-foreground/60 font-mono">
                  Supports jazz, funk, latin, and fusion styles
                </p>
              </div>
            )}
          </div>
        </main>

        {/* ── Right Panel ───────────────────────────────────── */}
        <aside className="hidden xl:flex flex-col w-56 border-l border-border bg-sidebar flex-shrink-0 p-4 space-y-5">
          {/* AI Settings */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              AI Settings
            </p>
            <div className="space-y-3">
              {[
                { label: "Notation Style", value: "Jazz" },
                { label: "Swing Amount", value: "67%" },
                { label: "Quantize", value: "1/8" },
                { label: "Model", value: "v2.1 Pro" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                  <span className="text-[11px] font-mono text-primary/80 bg-primary/5 border border-primary/20 px-1.5 py-0.5 rounded cursor-pointer hover:bg-primary/10 transition-colors">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-border" />

          {/* Drum kit legend */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Drum Components
            </p>
            <div className="space-y-2">
              {[
                { abbr: "HH", name: "Hi-Hat", color: "text-primary" },
                { abbr: "SN", name: "Snare", color: "text-primary" },
                { abbr: "BD", name: "Bass Drum", color: "text-primary" },
                { abbr: "T1", name: "Hi Tom", color: "text-primary/60" },
                { abbr: "TF", name: "Floor Tom", color: "text-primary/60" },
                { abbr: "RD", name: "Ride", color: "text-primary/60" },
                { abbr: "CR", name: "Crash", color: "text-yellow-500/70" },
              ].map(({ abbr, name, color }) => (
                <div key={abbr} className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-mono w-6", color)}>{abbr}</span>
                  <span className="text-[11px] text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="rounded-md bg-muted/30 border border-border p-3 text-center space-y-1">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Credits</p>
              <p className="text-lg font-mono font-bold text-foreground">47</p>
              <button className="text-[10px] font-mono text-primary hover:underline">
                Get more →
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
