"use client"

import { useEffect } from "react"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any
    const init = async () => {
      const Lenis = (await import("lenis")).default
      lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
    }
    init()
    return () => lenis?.destroy()
  }, [])

  return <>{children}</>
}
