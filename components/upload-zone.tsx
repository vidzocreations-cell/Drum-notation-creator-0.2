"use client"

import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) onFileSelect(file)
    },
    [disabled, onFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <label
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-all duration-200",
        dragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-muted/30",
        disabled && "pointer-events-none opacity-40"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        className="sr-only"
        accept="audio/*,video/*,.mp3,.wav,.flac,.ogg,.mp4,.m4a"
        onChange={handleFileChange}
        disabled={disabled}
        aria-label="Upload audio or video file"
      />

      {/* Icon */}
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full border transition-colors",
          dragging ? "border-primary bg-primary/10" : "border-border bg-muted"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn("h-7 w-7 transition-colors", dragging ? "text-primary" : "text-muted-foreground")}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {dragging ? "Drop your track here" : "Drag & drop an audio or video file"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          MP3, WAV, FLAC, OGG, MP4 — up to 200 MB
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-px w-8 bg-border" />
        <span>or click to browse</span>
        <span className="h-px w-8 bg-border" />
      </div>

      {dragging && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none animate-pulse" />
      )}
    </label>
  )
}
