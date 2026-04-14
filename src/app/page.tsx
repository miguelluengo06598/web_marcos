"use client"

import Link from "next/link"
import ContactForm from "./ContactForm"
import { motion, useScroll, useTransform, useSpring, animate } from "framer-motion"
import { useRef, useEffect, useState } from "react"

function useTypewriter(text: string, speed = 30, delay = 0) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) { clearInterval(interval); setDone(true) }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, speed, delay])
  return { displayed, done }
}

function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => ctrl.stop()
  }, [inView, value])
  return <>{display}</>
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsInView, setStatsInView] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  const line1 = useTypewriter("Tu patrimonio,", 40, 300)
  const line2 = useTypewriter("gestionado con", 40, 900)
  const line3 = useTypewriter("criterio.", 40, 1500)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsInView(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F4F1EB] text-[#1a1a1a] overflow-x-hidden" style={{cursor: "none"}}>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-[#F4F1EB]/95 backdrop-blur-sm border-b border-black/5"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/" className="text-xs font-medium tracking-[0.2em] uppercase text-black">
            WM Patrimonial
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-10">
          {["servicios", "nosotros", "contacto"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className="text-[10px] uppercase tracking-[0.2em] text-black/35 hover:text-black transition-colors duration-300"
            >
              {item}
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Link href="/login" className="text-[10px] uppercase tracking-[0.2em] text-black/35 hover:text-black transition-colors duration-300 border border-black/15 px-5 py-2.5 hover:border-black/50">
            Acceder
          </Link>
        </motion.div>
      </motion.nav>

      {/* Hero con parallax */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-8 max-w-7xl mx-auto"
      >
        <div className="flex items-start justify-between pt-16">
          <div className="max-w-5xl">
            <div className="text-[9vw] font-light leading-[1.02] tracking-[-0.03em] overflow-hidden" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line1.displayed}<span className="animate-pulse">|</span>
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line2.displayed}
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="italic text-black/20">{line3.displayed}</span>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-right max-w-[220px] pt-6 hidden md:block"
          >
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/25 mb-3">Asesoramiento</p>
            <p className="text-xs text-black/40 leading-relaxed">
              Independiente, personalizado y sin conflictos de interes.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex items-end justify-between border-t border-black/10 pt-8 mt-auto"
        >
          <div className="flex items-center gap-6">
            <a href="#servicios" className="text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors flex items-center gap-2 group">
              <span>Descubrir</span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >↓</motion.span>
            </a>
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[10px] uppercase tracking-[0.2em] bg-black text-white px-7 py-3.5 hover:bg-black/80 transition-colors"
            >
              Primera consulta gratuita
            </motion.a>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["+10 anos", "+50 clientes", "10M+ gestionados"].map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 + i * 0.1 }}
                className="text-[9px] text-black/25 uppercase tracking-[0.15em]"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Intro */}
      <section className="border-t border-black/8 py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-2">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[9px] uppercase tracking-[0.2em] text-black/25"
            >
              Que hacemos
            </motion.p>
          </div>
          <div className="col-span-1">
            <div className="w-px bg-black/8 h-full mx-auto" />
          </div>
          <div className="col-span-9">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl font-light leading-relaxed tracking-tight mb-8 max-w-3xl"
              style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
            >
              La gestion patrimonial es un reto complejo. Nuestra plataforma esta disenada para simplificarlo con transparencia, independencia y tecnologia.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm text-black/35 leading-relaxed max-w-lg"
            >
              Combinando analisis financiero riguroso, seguimiento en tiempo real y comunicacion directa, ofrecemos a cada cliente una vision clara de su patrimonio en cada momento.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats animados */}
      <section ref={statsRef} className="border-t border-black/8 py-20 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-0">
          {[
            { to: 10, suffix: "+", label: "Anos de experiencia" },
            { to: 50, suffix: "+", label: "Clientes activos" },
            { to: 10, suffix: "M+", label: "Euros bajo gestion" },
            { to: 8, suffix: ",2%", label: "Rentabilidad media" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-l border-black/8 px-8 py-6 first:border-l-0"
            >
              <p className="text-5xl font-light mb-2 tracking-tight" style={{fontFamily: "Georgia, serif"}}>
                <AnimatedNumber value={stat.to} inView={statsInView} />{stat.suffix}
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-black/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="border-t border-black/8 py-24 px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[9px] uppercase tracking-[0.2em] text-black/25"
          >
            Servicios
          </motion.p>
          <p className="text-[9px] text-black/15 tracking-widest">01 / 03</p>
        </div>

        <div>
          {[
            { num: "01", title: "Planificacion patrimonial", desc: "Diseno de estrategias de inversion adaptadas a tus objetivos vitales y horizonte temporal. Cada decision, justificada y transparente." },
            { num: "02", title: "Gestion de carteras", desc: "Seleccion y seguimiento de activos con criterios de rentabilidad y control riguroso del riesgo. Posiciones actualizadas en tiempo real." },
            { num: "03", title: "Asesoramiento continuo", desc: "Acceso directo a tu asesor, analisis periodicos del mercado y portal personal disponible 24/7 desde cualquier dispositivo." },
          ].map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="grid grid-cols-12 gap-8 py-12 border-t border-black/8 group cursor-default"
            >
              <div className="col-span-1">
                <span className="text-[10px] text-black/20 tracking-widest">{s.num}</span>
              </div>
              <div className="col-span-5">
                <h3
                  className="text-2xl font-light group-hover:translate-x-3 transition-transform duration-700 ease-out"
                  style={{fontFamily: "Georgia, serif"}}
                >
                  {s.title}
                </h3>
              </div>
              <div className="col-span-5">
                <p className="text-sm text-black/35 leading-relaxed">{s.desc}</p>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="text-black/20 text-lg group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="border-t border-black/8 py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/25 mb-10">Independencia</p>
            <h2 className="text-4xl font-light leading-tight mb-12" style={{fontFamily: "Georgia, serif"}}>
              Sin conflictos<br />de interes.<br />
              <span className="italic text-black/20">Solo tu patrimonio importa.</span>
            </h2>
            <div className="space-y-0">
              {[
                { num: "01", text: "Sin vinculacion a ninguna entidad financiera. Recomiendo lo mejor para ti." },
                { num: "02", text: "Transparencia total en comisiones y rentabilidades. Sin sorpresas." },
                { num: "03", text: "Portal personal con tu cartera actualizada en tiempo real. 24/7." },
                { num: "04", text: "Atencion directa y personalizada. Hablas conmigo, no con un call center." },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-6 items-start border-t border-black/8 py-5 group"
                >
                  <span className="text-[9px] text-black/15 tracking-widest flex-shrink-0 pt-0.5">{item.num}</span>
                  <p className="text-sm text-black/45 leading-relaxed group-hover:text-black/70 transition-colors duration-300">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pt-16 space-y-4"
          >
            <div className="border border-black/8 p-7 bg-white/60 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-black/25 mb-2">Valor total cartera</p>
                  <p className="text-5xl font-light tracking-tight" style={{fontFamily: "Georgia, serif"}}>124.850</p>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-green-700 border border-green-200 bg-green-50/80 px-3 py-1.5">+7,4% YTD</span>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Renta variable", pct: 45 },
                  { label: "Renta fija", pct: 35 },
                  { label: "Liquidez", pct: 12 },
                  { label: "Alternativos", pct: 8 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-5">
                    <span className="text-[9px] uppercase tracking-widest text-black/25 w-24 flex-shrink-0">{item.label}</span>
                    <div className="flex-1 h-px bg-black/8 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-0 left-0 h-px bg-black/50"
                      />
                    </div>
                    <span className="text-[10px] text-black/35 w-8 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-black/8 p-5 bg-white/40">
                <p className="text-[9px] uppercase tracking-widest text-black/20 mb-2">Ultima actualizacion</p>
                <p className="text-sm font-light">Hoy, 14:32</p>
                <p className="text-[9px] text-black/20 mt-1">por tu asesor</p>
              </div>
              <div className="border border-black/8 p-5 bg-white/40">
                <p className="text-[9px] uppercase tracking-widest text-black/20 mb-2">Proxima revision</p>
                <p className="text-sm font-light">30 abr 2026</p>
                <p className="text-[9px] text-green-600 mt-1">en 15 dias</p>
              </div>
            </div>
            <p className="text-[9px] text-black/15 uppercase tracking-[0.2em] text-center pt-1">Vista previa del portal de cliente</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/8 py-36 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[9px] uppercase tracking-[0.25em] text-black/25 mb-10">Empezar</p>
          <h2
            className="text-[6vw] font-light tracking-[-0.02em] mb-12 max-w-3xl mx-auto leading-tight"
            style={{fontFamily: "Georgia, 'Times New Roman', serif"}}
          >
            Reescribamos la historia de tu patrimonio.
          </h2>
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.03, backgroundColor: "#1a1a1a" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] border border-black px-10 py-5 hover:bg-black hover:text-white transition-all duration-400"
          >
            <span>Solicitar consulta gratuita</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >→</motion.span>
          </motion.a>
        </motion.div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="border-t border-black/8 py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/25 mb-10">Contacto</p>
            <h2 className="text-5xl font-light leading-tight mb-8" style={{fontFamily: "Georgia, serif"}}>
              Hablemos.
            </h2>
            <p className="text-sm text-black/35 leading-relaxed mb-12 max-w-xs">
              Sin compromiso. Primera consulta gratuita. Te respondo en menos de 24 horas.
            </p>
            <div className="space-y-0">
              {[
                { label: "Experiencia", val: "+10 anos en gestion patrimonial" },
                { label: "Clientes", val: "+50 familias e inversores" },
                { label: "Patrimonio", val: "+10M euros bajo gestion" },
              ].map((item) => (
                <div key={item.label} className="flex gap-8 border-t border-black/8 py-4">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-black/20 w-20 flex-shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-xs text-black/45">{item.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/8 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.2em] text-black/20">WM Patrimonial</span>
          <div className="flex items-center gap-8">
            {["servicios", "contacto"].map((item) => (
              <a key={item} href={`#${item}`} className="text-[9px] uppercase tracking-[0.2em] text-black/15 hover:text-black/50 transition-colors">{item}</a>
            ))}
            <Link href="/login" className="text-[9px] uppercase tracking-[0.2em] text-black/15 hover:text-black/50 transition-colors">Acceso clientes</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
