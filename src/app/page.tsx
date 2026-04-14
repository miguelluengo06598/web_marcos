"use client"

import Link from "next/link"
import ContactForm from "./ContactForm"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto border-b border-white/5 sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md"
      >
        <span className="font-semibold text-white tracking-tight">WM Patrimonial</span>
        <div className="flex items-center gap-6">
          <a href="#servicios" className="text-sm text-white/50 hover:text-white transition-colors">Servicios</a>
          <a href="#contacto" className="text-sm text-white/50 hover:text-white transition-colors">Contacto</a>
          <Link href="/login" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
            Acceder
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-6 pt-28 pb-24 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.style variants={heroOpacity}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-white/60">Asesoramiento independiente y sin conflictos de interes</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl font-semibold tracking-tight leading-tight mb-6 max-w-3xl mx-auto"
            >
              Tu patrimonio,<br />
              <span className="text-white/25">gestionado con criterio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/40 mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Accede a tu cartera en tiempo real. Recibe analisis del mercado. Invierte con informacion clara y sin letra pequena.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-3"
            >
              <a href="#contacto" className="bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/90 hover:scale-105 transition-all duration-200">
                Solicitar informacion
              </a>
              <Link href="/login" className="border border-white/10 text-white/60 px-6 py-3 rounded-lg text-sm hover:bg-white/5 hover:text-white hover:scale-105 transition-all duration-200">
                Soy cliente
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
            >
              {[
                { value: "+10 anos", label: "de experiencia" },
                { value: "+50", label: "clientes activos" },
                { value: "10M+", label: "patrimonio gestionado" },
                { value: "8,2%", label: "rentabilidad media" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="bg-white/3 border border-white/5 rounded-xl p-5 text-center hover:bg-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.style>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-semibold tracking-tight mb-4">Que ofrezco</motion.h2>
            <motion.p variants={fadeUp} className="text-white/40 text-sm max-w-md mx-auto">Un servicio completo de gestion patrimonial, adaptado a tu situacion y objetivos.</motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { icon: "◎", title: "Planificacion patrimonial", desc: "Diseno de estrategias de inversion adaptadas a tus objetivos vitales y horizonte temporal." },
              { icon: "◈", title: "Gestion de carteras", desc: "Seleccion y seguimiento de activos con criterios de rentabilidad y control riguroso del riesgo." },
              { icon: "◇", title: "Asesoramiento continuo", desc: "Acceso directo a tu asesor, actualizaciones de mercado y portal personal disponible 24/7." },
            ].map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
                className="bg-white/3 border border-white/5 rounded-2xl p-6 cursor-default transition-colors"
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-5 text-lg">{s.icon}</div>
                <h3 className="font-medium text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Por que yo */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="text-3xl font-semibold tracking-tight mb-6">
                Sin conflictos de interes.<br />
                <span className="text-white/25">Solo tu patrimonio importa.</span>
              </motion.h2>
              <div className="space-y-4">
                {[
                  "Sin vinculacion a ninguna entidad financiera. Recomiendo lo que es mejor para ti.",
                  "Transparencia total en comisiones y rentabilidades. Sin sorpresas.",
                  "Portal personal con tu cartera actualizada en tiempo real. Disponible 24/7.",
                  "Atencion directa y personalizada. No eres un numero.",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    variants={fadeUp}
                    custom={i}
                    className="flex gap-3 items-start"
                  >
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-white/50 leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/3 border border-white/5 rounded-2xl p-8 space-y-4"
            >
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/30 mb-1">Valor total cartera</p>
                <p className="text-2xl font-semibold">124.850</p>
                <p className="text-xs text-green-400 mt-0.5">+7,4% este ano</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Renta variable</p>
                  <p className="text-lg font-semibold">45%</p>
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "45%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                      className="h-1 bg-blue-400 rounded-full"
                    />
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Renta fija</p>
                  <p className="text-lg font-semibold">35%</p>
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "35%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                      className="h-1 bg-green-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/20 text-center">Vista previa del portal de cliente</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-4xl font-semibold tracking-tight mb-4 relative">
              Empieza a gestionar<br />tu patrimonio hoy
            </h2>
            <p className="text-white/40 text-sm mb-8">Primera consulta gratuita y sin compromiso.</p>
            <motion.a
              href="#contacto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-black px-8 py-3 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors inline-block"
            >
              Solicitar consulta gratuita
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-24 border-t border-white/5">
        <div className="max-w-lg mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-semibold tracking-tight mb-3">Hablemos</h2>
            <p className="text-sm text-white/40">Sin compromiso. Te respondo en menos de 24 horas.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm text-white/20">WM Patrimonial</span>
          <Link href="/login" className="text-sm text-white/20 hover:text-white transition-colors">
            Acceso clientes
          </Link>
        </div>
      </footer>

    </div>
  )
}
