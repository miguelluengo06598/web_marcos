"use client"

import Link from "next/link"
import ContactForm from "./ContactForm"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState, useRef } from "react"

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [to])
  return <span>{val}{suffix}</span>
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const },
  }),
}

export default function HomePage() {
  const [inView, setInView] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px"}} />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-50 px-8 py-4 flex items-center justify-between max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <span className="text-black text-xs font-bold">W</span>
          </div>
          <span className="font-semibold text-white text-sm">WM Patrimonial</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#servicios" className="text-sm text-white/50 hover:text-white transition-colors duration-200">Servicios</a>
          <a href="#nosotros" className="text-sm text-white/50 hover:text-white transition-colors duration-200">Nosotros</a>
          <a href="#contacto" className="text-sm text-white/50 hover:text-white transition-colors duration-200">Contacto</a>
        </div>
        <Link href="/login" className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors duration-200">
          Acceder
        </Link>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 text-center">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/3 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-xs text-white/60 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Asesoramiento independiente — sin conflictos de interes
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto"
        >
          Tu patrimonio,<br />
          <span className="bg-gradient-to-r from-white/20 via-white/40 to-white/20 bg-clip-text text-transparent">
            gestionado con criterio
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-xl text-white/40 mb-10 max-w-lg mx-auto leading-relaxed font-light"
        >
          Accede a tu cartera en tiempo real. Analisis del mercado. Decisiones claras y sin letra pequena.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-black px-7 py-3 rounded-xl text-sm font-semibold shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            Solicitar informacion gratuita
          </motion.a>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/login" className="border border-white/10 text-white/60 px-7 py-3 rounded-xl text-sm font-medium hover:bg-white/5 hover:text-white transition-all duration-200 inline-block">
              Soy cliente →
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xs text-white/25"
        >
          Primera consulta gratuita y sin compromiso
        </motion.p>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-4 gap-3 mt-20 max-w-3xl mx-auto">
          {[
            { to: 10, suffix: "+", label: "Anos de experiencia" },
            { to: 50, suffix: "+", label: "Clientes activos" },
            { to: 10, suffix: "M+", label: "Euros gestionados" },
            { to: 8, suffix: ",2%", label: "Rentabilidad media" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.12)" }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center backdrop-blur-sm cursor-default transition-colors"
            >
              <p className="text-3xl font-bold text-white mb-1">
                {inView ? <Counter to={stat.to} suffix={stat.suffix} /> : "0"}
              </p>
              <p className="text-xs text-white/35 leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="relative z-10 py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Servicios</p>
            <h2 className="text-4xl font-bold tracking-tight max-w-md">Todo lo que necesitas para gestionar tu patrimonio</h2>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: "◎",
                tag: "Estrategia",
                title: "Planificacion patrimonial",
                desc: "Diseno de estrategias de inversion adaptadas a tus objetivos vitales y horizonte temporal.",
                color: "from-blue-500/10 to-transparent",
              },
              {
                icon: "◈",
                tag: "Inversion",
                title: "Gestion de carteras",
                desc: "Seleccion y seguimiento de activos con criterios de rentabilidad y control riguroso del riesgo.",
                color: "from-purple-500/10 to-transparent",
              },
              {
                icon: "◇",
                tag: "Seguimiento",
                title: "Asesoramiento continuo",
                desc: "Acceso directo a tu asesor, analisis de mercado y portal personal disponible 24/7.",
                color: "from-cyan-500/10 to-transparent",
              },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.1)" }}
                className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 overflow-hidden cursor-default"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} pointer-events-none`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-full border border-white/5">{s.tag}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-lg">{s.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que yo */}
      <section id="nosotros" className="relative z-10 py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Por que elegirnos</p>
              <h2 className="text-4xl font-bold tracking-tight mb-8 leading-tight">
                Sin conflictos de interes.<br />
                <span className="text-white/25">Solo tu patrimonio importa.</span>
              </h2>
              <div className="space-y-5">
                {[
                  { title: "100% independiente", desc: "Sin vinculacion a ninguna entidad. Recomiendo lo mejor para ti, no lo que me genera mas comision." },
                  { title: "Transparencia total", desc: "Comisiones y rentabilidades claras. Sin sorpresas ni letra pequena." },
                  { title: "Portal 24/7", desc: "Tu cartera actualizada en tiempo real. Accede cuando quieras desde cualquier dispositivo." },
                  { title: "Atencion directa", desc: "Hablas conmigo, no con un call center. Respondo en menos de 24 horas." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-0.5">{item.title}</p>
                      <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Card preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-white/30 mb-1">Valor total cartera</p>
                    <p className="text-3xl font-bold">124.850</p>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">+7,4% YTD</span>
                </div>
                <div className="h-px bg-white/5 mb-4" />
                <div className="space-y-3">
                  {[
                    { label: "Renta variable", pct: 45, color: "bg-blue-400" },
                    { label: "Renta fija", pct: 35, color: "bg-green-400" },
                    { label: "Liquidez", pct: 12, color: "bg-amber-400" },
                    { label: "Alternativos", pct: 8, color: "bg-purple-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/50">{item.label}</span>
                        <span className="text-white/70 font-medium">{item.pct}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                          className={`h-1 ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-xs text-white/30 mb-2">Ultima actualizacion</p>
                  <p className="text-sm font-medium">Hoy, 14:32</p>
                  <p className="text-xs text-white/30 mt-1">por tu asesor</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-xs text-white/30 mb-2">Proximo revision</p>
                  <p className="text-sm font-medium">30 abr 2026</p>
                  <p className="text-xs text-green-400 mt-1">en 15 dias</p>
                </div>
              </div>

              <p className="text-xs text-white/15 text-center pt-1">Vista previa del portal de cliente</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative z-10 py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-5xl font-bold tracking-tight mb-4">
                Empieza hoy.<br />
                <span className="text-white/30">Sin compromiso.</span>
              </h2>
              <p className="text-white/40 mb-10 max-w-sm mx-auto">Primera consulta gratuita. Te respondo en menos de 24 horas.</p>
              <motion.a
                href="#contacto"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-black px-10 py-4 rounded-xl text-sm font-semibold inline-block shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Solicitar consulta gratuita
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="relative z-10 py-28 border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Contacto</p>
            <h2 className="text-4xl font-bold tracking-tight mb-3">Hablemos</h2>
            <p className="text-sm text-white/40">Sin compromiso. Te respondo en menos de 24 horas.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
              <span className="text-black text-xs font-bold">W</span>
            </div>
            <span className="text-sm text-white/20">WM Patrimonial</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#servicios" className="text-xs text-white/20 hover:text-white/50 transition-colors">Servicios</a>
            <a href="#contacto" className="text-xs text-white/20 hover:text-white/50 transition-colors">Contacto</a>
            <Link href="/login" className="text-xs text-white/20 hover:text-white/50 transition-colors">Acceso clientes</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
