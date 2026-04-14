"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const down = () => setClicked(true)
    const up = () => setClicked(false)
    window.addEventListener("mousemove", move)
    window.addEventListener("mousedown", down)
    window.addEventListener("mouseup", up)

    const addHover = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach(el => {
        el.addEventListener("mouseenter", () => setHovered(true))
        el.addEventListener("mouseleave", () => setHovered(false))
      })
    }
    addHover()
    const obs = new MutationObserver(addHover)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mousedown", down)
      window.removeEventListener("mouseup", up)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-black rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: pos.x - 3, y: pos.y - 3, scale: clicked ? 0.5 : 1 }}
        transition={{ type: "spring", stiffness: 2000, damping: 80, mass: 0.1 }}
      />
      {/* Circle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border border-black/30 mix-blend-difference"
        animate={{
          x: pos.x - (hovered ? 24 : 16),
          y: pos.y - (hovered ? 24 : 16),
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          scale: clicked ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.3 }}
      />
    </>
  )
}
