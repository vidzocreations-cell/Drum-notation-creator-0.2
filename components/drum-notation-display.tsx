"use client"

import { useEffect, useRef } from "react"

interface Beat {
  hiHat?: boolean
  ride?: boolean
  crash?: boolean
  snare?: boolean
  bass?: boolean
  tomHigh?: boolean
  tomMid?: boolean
  tomFloor?: boolean
  accent?: boolean
}

const SAMPLE_PATTERN: Beat[] = [
  { hiHat: true, bass: true },
  { hiHat: true },
  { hiHat: true, snare: true },
  { hiHat: true },
  { hiHat: true, bass: true },
  { hiHat: true, bass: true },
  { hiHat: true, snare: true },
  { hiHat: true, accent: true },
  { ride: true, bass: true },
  { hiHat: true },
  { snare: true, tomHigh: true },
  { hiHat: true },
  { bass: true, hiHat: true },
  { hiHat: true },
  { snare: true, crash: true },
  { hiHat: true, bass: true },
]

const GOLD = "#D4A843"
const GOLD_DIM = "#8A6B28"
const STAFF_COLOR = "#2e2e2e"
const TEXT_COLOR = "#6b6b6b"

export function DrumNotationDisplay({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    draw(ctx, W, H)
  }, [active])

  function draw(ctx: CanvasRenderingContext2D, W: number, H: number) {
    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = "#0d0d0d"
    ctx.fillRect(0, 0, W, H)

    const marginLeft = 60
    const marginRight = 20
    const beatsPerMeasure = 8
    const measures = 2
    const totalBeats = beatsPerMeasure * measures
    const usableWidth = W - marginLeft - marginRight
    const beatWidth = usableWidth / totalBeats

    // Staff rows: hi-hat/ride, snare, bass drum
    const staffTop = 40
    const lineSpacing = 18
    const staffLines = 5
    const staffHeight = (staffLines - 1) * lineSpacing
    const staffBottom = staffTop + staffHeight

    // Row centers
    const rowHiHat = staffTop - 16         // above staff
    const rowCymbal = staffTop - 8         // crash / ride
    const rowTomHigh = staffTop + 4
    const rowTomMid = staffTop + lineSpacing
    const rowSnare = staffTop + lineSpacing * 2
    const rowTomFloor = staffTop + lineSpacing * 3
    const rowBass = staffBottom + 16       // below staff

    // Draw clef label
    ctx.font = "bold 11px 'Space Mono', monospace"
    ctx.fillStyle = GOLD_DIM
    ctx.textAlign = "left"
    ctx.fillText("PERC", 4, staffTop + staffHeight / 2 + 4)

    // Draw measure numbers
    for (let m = 0; m < measures; m++) {
      const mx = marginLeft + m * beatsPerMeasure * beatWidth
      ctx.font = "10px 'Space Mono', monospace"
      ctx.fillStyle = TEXT_COLOR
      ctx.textAlign = "left"
      ctx.fillText(`${m + 1}`, mx + 2, staffTop - 24)
    }

    // Draw staff lines
    for (let i = 0; i < staffLines; i++) {
      const y = staffTop + i * lineSpacing
      ctx.strokeStyle = STAFF_COLOR
      ctx.lineWidth = i === 0 || i === staffLines - 1 ? 1.5 : 1
      ctx.beginPath()
      ctx.moveTo(marginLeft, y)
      ctx.lineTo(W - marginRight, y)
      ctx.stroke()
    }

    // Draw bar lines
    for (let m = 0; m <= measures; m++) {
      const x = marginLeft + m * beatsPerMeasure * beatWidth
      ctx.strokeStyle = m === 0 || m === measures ? "#3a3a3a" : STAFF_COLOR
      ctx.lineWidth = m === 0 || m === measures ? 2 : 1
      ctx.beginPath()
      ctx.moveTo(x, staffTop - 20)
      ctx.lineTo(x, staffBottom + 20)
      ctx.stroke()
    }

    // Draw beat tick marks + beat numbers
    for (let b = 0; b < totalBeats; b++) {
      const x = marginLeft + b * beatWidth + beatWidth / 2
      const beatInMeasure = b % beatsPerMeasure
      const isQuarter = beatInMeasure % 2 === 0

      // Beat number for quarter notes
      if (isQuarter) {
        ctx.font = "9px 'Space Mono', monospace"
        ctx.fillStyle = "#3a3a3a"
        ctx.textAlign = "center"
        ctx.fillText(`${beatInMeasure / 2 + 1}`, x, staffBottom + 36)
      }

      // Subtle vertical grid
      ctx.strokeStyle = isQuarter ? "#1e1e1e" : "#181818"
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x, staffTop)
      ctx.lineTo(x, staffBottom)
      ctx.stroke()
    }

    // Row labels
    const labels: [number, string][] = [
      [rowHiHat, "HH"],
      [rowSnare, "SN"],
      [rowBass, "BD"],
      [rowTomHigh, "T1"],
      [rowTomFloor, "TF"],
    ]
    labels.forEach(([y, label]) => {
      ctx.font = "8px 'Space Mono', monospace"
      ctx.fillStyle = TEXT_COLOR
      ctx.textAlign = "right"
      ctx.fillText(label, marginLeft - 6, y + 4)
    })

    // Draw notes
    SAMPLE_PATTERN.slice(0, totalBeats).forEach((beat, i) => {
      const x = marginLeft + i * beatWidth + beatWidth / 2

      function drawX(y: number, color = GOLD) {
        const s = 5
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(x - s, y - s)
        ctx.lineTo(x + s, y + s)
        ctx.moveTo(x + s, y - s)
        ctx.lineTo(x - s, y + s)
        ctx.stroke()
      }

      function drawCircle(y: number, filled = true, color = GOLD) {
        const r = 5
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        if (filled) {
          ctx.fillStyle = color
          ctx.fill()
        } else {
          ctx.strokeStyle = color
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      function drawDiamond(y: number, color = GOLD) {
        const s = 5
        ctx.beginPath()
        ctx.moveTo(x, y - s)
        ctx.lineTo(x + s, y)
        ctx.lineTo(x, y + s)
        ctx.lineTo(x - s, y)
        ctx.closePath()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      function drawStem(y1: number, y2: number) {
        ctx.strokeStyle = GOLD_DIM
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, y1)
        ctx.lineTo(x, y2)
        ctx.stroke()
      }

      if (beat.hiHat) {
        const col = beat.accent ? "#F5C842" : GOLD_DIM
        drawX(rowHiHat, col)
        drawStem(rowHiHat + 5, rowSnare)
      }
      if (beat.ride) {
        drawX(rowCymbal, GOLD)
        drawStem(rowCymbal + 5, rowSnare)
      }
      if (beat.crash) {
        drawX(rowCymbal - 12, "#F5C842")
      }
      if (beat.snare) {
        drawCircle(rowSnare, true, GOLD)
      }
      if (beat.tomHigh) {
        drawCircle(rowTomHigh, true, GOLD_DIM)
      }
      if (beat.tomMid) {
        drawCircle(rowTomMid, true, GOLD_DIM)
      }
      if (beat.tomFloor) {
        drawCircle(rowTomFloor, false, GOLD_DIM)
      }
      if (beat.bass) {
        drawDiamond(rowBass, GOLD)
      }
    })

    // Jazz flourish: "4/4" time signature
    ctx.font = "bold 22px serif"
    ctx.fillStyle = "#2a2a2a"
    ctx.textAlign = "center"
    ctx.fillText("4", marginLeft - 22, staffTop + lineSpacing * 1.5)
    ctx.fillText("4", marginLeft - 22, staffTop + lineSpacing * 3.5)

    // Tempo marking
    ctx.font = "italic 11px serif"
    ctx.fillStyle = GOLD_DIM
    ctx.textAlign = "left"
    ctx.fillText("♩ = 132  (Swing)", marginLeft, staffTop - 32)
  }

  return (
    <div className="relative w-full h-full min-h-[160px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: 160 }}
        aria-label="Jazz drum notation display"
      />
      {active && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono text-primary/70 tracking-widest uppercase">
              Live
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
