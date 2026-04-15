"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import ContactForm from "./ContactForm"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" } }),
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <span className="font-semibold text-gray-900 text-sm">Gestion Patrimonial</span>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <a href="#servicios" className="hover:text-gray-900 transition-colors">Servicios</a>
            <a href="#nosotros" className="hover:text-gray-900 transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-gray-900 transition-colors">Contacto</a>
            <Link href="/login" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors">
              Acceder
            </Link>
          </div>
          <button className="sm:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
        </div>
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
            {["#servicios", "#nosotros", "#contacto"].map((href, i) => (
              <a key={href} href={href} className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
                {["Servicios", "Nosotros", "Contacto"][i]}
              </a>
            ))}
            <Link href="/login" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium text-center">Acceder</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 mb-6 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Asesoramiento independiente
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-5 leading-tight">
          Tu patrimonio,<br />
          <span className="text-gray-300">gestionado con criterio</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Accede a tu cartera en tiempo real. Recibe analisis del mercado. Invierte con informacion clara y sin sorpresas.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#contacto" className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors text-center">
            Solicitar informacion
          </a>
          <Link href="/login" className="w-full sm:w-auto border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors text-center">
            Soy cliente →
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-14 max-w-2xl mx-auto">
          {[
            { value: "+10", label: "Anos experiencia" },
            { value: "+50", label: "Clientes activos" },
            { value: "10M+", label: "Euros gestionados" },
            { value: "8,2%", label: "Rentabilidad media" },
          ].map((s, i) => (
            <motion.div key={s.label} custom={i} variants={fadeUp}
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="bg-gray-50 py-16 sm:py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">Que ofrezco</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">Un servicio completo de gestion patrimonial adaptado a tus objetivos.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "◎", title: "Planificacion patrimonial", desc: "Estrategias de inversion adaptadas a tus objetivos y horizonte temporal." },
              { icon: "◈", title: "Gestion de carteras", desc: "Seleccion y seguimiento de activos con criterios de rentabilidad y control del riesgo." },
              { icon: "◇", title: "Asesoramiento continuo", desc: "Acceso directo a tu asesor y actualizaciones del mercado en tu portal personal." },
            ].map((s, i) => (
              <motion.div key={s.title} custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-lg">{s.icon}</div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-16 sm:py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 leading-tight">
                Sin conflictos de interes.<br />
                <span className="text-gray-300">Solo tu patrimonio importa.</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Sin vinculacion a ninguna entidad financiera. Recomiendo lo mejor para ti.",
                  "Transparencia total en comisiones y rentabilidades. Sin sorpresas.",
                  "Portal personal con tu cartera actualizada en tiempo real. 24/7.",
                  "Atencion directa y personalizada. No eres un numero.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <span className="text-green-500 mt-0.5 flex-shrink-0 text-sm">✓</span>
                    <p className="text-sm text-gray-500 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                <p className="text-xs text-gray-400 mb-1">Valor total cartera</p>
                <p className="text-2xl font-semibold text-gray-900">124.850</p>
                <p className="text-xs text-green-500 mt-1">+7,4% este ano</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Renta variable", pct: 45, color: "bg-blue-400" },
                  { label: "Renta fija", pct: 35, color: "bg-green-400" },
                ].map(item => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-base font-semibold text-gray-900">{item.pct}%</p>
                    <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.pct}%` }} viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }} className={`h-1 ${item.color} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-300 text-center mt-3">Vista previa del portal de cliente</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 sm:py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
              Empieza a gestionar tu patrimonio hoy
            </h2>
            <p className="text-gray-400 text-sm mb-8">Primera consulta gratuita y sin compromiso.</p>
            <a href="#contacto" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              Solicitar consulta gratuita
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-16 sm:py-24 border-t border-gray-100">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Hablemos</h2>
            <p className="text-sm text-gray-400">Sin compromiso. Te respondo en menos de 24 horas.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-300 font-medium">Gestion Patrimonial</span>
          <div className="flex items-center gap-6 text-xs text-gray-300">
            <a href="#servicios" className="hover:text-gray-600 transition-colors">Servicios</a>
            <a href="#contacto" className="hover:text-gray-600 transition-colors">Contacto</a>
            <Link href="/login" className="hover:text-gray-600 transition-colors">Acceso clientes</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
