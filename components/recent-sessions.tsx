"use client"

import { cn } from "@/lib/utils"

export interface Session {
  id: string
  title: string
  source: "file" | "youtube"
  status: "done" | "processing" | "error"
  date: string
  bpm?: number
  style?: string
}

const INITIAL_SESSIONS: Session[] = [
  {
    id: "1",
    title: "Autumn Leaves — Bill Evans",
    source: "youtube",
    status: "done",
    date: "2 min ago",
    bpm: 126,
    style: "Jazz Swing",
  },
  {
    id: "2",
    title: "So What — Miles Davis",
    source: "file",
    status: "done",
    date: "1 hr ago",
    bpm: 136,
    style: "Modal Jazz",
  },
  {
    id: "3",
    title: "Take Five — Dave Brubeck",
    source: "youtube",
    status: "done",
    date: "3 hrs ago",
    bpm: 172,
    style: "Jazz 5/4",
  },
  {
    id: "4",
    title: "A Night in Tunisia — Dizzy",
    source: "file",
    status: "error",
    date: "Yesterday",
    bpm: undefined,
    style: undefined,
  },
  {
    id: "5",
    title: "Footprints — Wayne Shorter",
    source: "youtube",
    status: "done",
    date: "2 days ago",
    bpm: 118,
    style: "Jazz 6/4",
  },
]

interface RecentSessionsProps {
  sessions?: Session[]
  onSelect?: (session: Session) => void
  activeId?: string
}

export function RecentSessions({ sessions = INITIAL_SESSIONS, onSelect, activeId }: RecentSessionsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Recent Sessions
        </h2>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {sessions.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelect?.(session)}
            className={cn(
              "w-full text-left rounded-md p-3 transition-all duration-150 border group",
              activeId === session.id
                ? "border-primary/40 bg-primary/5"
                : "border-transparent hover:border-border hover:bg-muted/40"
            )}
            aria-current={activeId === session.id ? "true" : undefined}
          >
            <div className="flex items-start gap-2.5">
              {/* Source icon */}
              <div
                className={cn(
                  "mt-0.5 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center",
                  session.source === "youtube" ? "bg-red-950/40" : "bg-secondary"
                )}
                aria-hidden="true"
              >
                {session.source === "youtube" ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-400">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-2.75 12 12 0 0 0-16.21 6.07 12 12 0 0 0 3.35 13.36 12 12 0 0 0 13.97.88 12 12 0 0 0 5.27-12.41 4.83 4.83 0 0 1-2.61-5.15zM10 15V9l5 3-5 3z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 19 6-14M4.5 9.5h15M4.5 14.5h15" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-xs font-medium truncate leading-relaxed",
                    activeId === session.id ? "text-primary" : "text-foreground"
                  )}
                >
                  {session.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {session.bpm && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      ♩{session.bpm}
                    </span>
                  )}
                  {session.style && (
                    <span className="text-[10px] text-muted-foreground truncate">
                      {session.style}
                    </span>
                  )}
                </div>
              </div>

              {/* Status + date */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <StatusDot status={session.status} />
                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                  {session.date}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: Session["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex w-1.5 h-1.5 rounded-full",
        status === "done" ? "bg-emerald-500" :
        status === "processing" ? "bg-primary animate-pulse" :
        "bg-destructive"
      )}
      aria-label={status}
    />
  )
}
