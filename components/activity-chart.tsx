"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function ActivityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Calculate dimensions
    const width = rect.width
    const height = rect.height
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Sample data
    const data = [3500, 5200, 4100, 7500, 4800, 6200]
    const maxValue = Math.max(...data)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw bars with animation
    const barWidth = (chartWidth / data.length) * 0.6
    const barSpacing = (chartWidth / data.length) * 0.4

    // Animate the bars
    const animationDuration = 1000 // ms
    const startTime = performance.now()

    const animateBars = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw bars with animation
      data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight * progress
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
        const y = height - padding - barHeight

        // Draw bar
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 5)
        ctx.fillStyle = index === 4 ? "#c2e8d7" : "#e0f5eb"
        ctx.fill()
      })

      // Draw day labels
      const days = ["Sun", "Mon", "Thu", "Wen", "Thr", "Fri"]
      ctx.fillStyle = "gray"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"

      days.forEach((day, index) => {
        const x = padding + index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2
        const y = height - 5
        ctx.fillText(day, x, y)
      })

      if (elapsed < animationDuration) {
        requestAnimationFrame(animateBars)
      }
    }

    requestAnimationFrame(animateBars)
  }, [])

  return (
    <motion.div
      className="w-full h-32 mt-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </motion.div>
  )
}
