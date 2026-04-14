"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import ContactFormWope from "./ContactFormWope"

const FEATURES = [
  { color: "#22c55e", icon: "◈", title: "Cartera en tiempo real", desc: "Visualiza el valor de tu patrimonio, posiciones y rentabilidad actualizada al momento." },
  { color: "#3b82f6", icon: "◎", title: "Productos exclusivos", desc: "Accede a recomendaciones privadas de inversion seleccionadas por tu asesor." },
  { color: "#a855f7", icon: "◇", title: "Noticias del mercado", desc: "Analisis y comentarios del asesor directamente en tu portal, como un feed privado." },
  { color: "#f97316", icon: "△", title: "Documentos seguros", desc: "Todos tus informes y documentos en un solo lugar, accesibles en cualquier momento." },
  { color: "#ec4899", icon: "○", title: "Notificaciones instant.", desc: "Tu asesor te avisa al instante cuando hay novedades relevantes para tu cartera." },
  { color: "#06b6d4", icon: "□", title: "Historial completo", desc: "Accede a toda la evolucion de tu patrimonio desde el primer dia." },
]

const STATS = [
  { value: "+10", label: "Anos de experiencia" },
  { value: "+50", label: "Clientes activos" },
  { value: "10M+", label: "Euros gestionados" },
  { value: "8.2%", label: "Rentabilidad media" },
]

const FAQ = [
  { q: "Que es WM Patrimonial?", a: "Un servicio de gestion patrimonial independiente. Sin vinculacion a bancos ni entidades financieras. Solo trabajo para ti." },
  { q: "Como accedo a mi cartera?", a: "Recibes acceso a tu portal privado donde puedes ver tu cartera, noticias del mercado y productos recomendados en tiempo real." },
  { q: "Con que frecuencia se actualiza mi cartera?", a: "Tu asesor actualiza los datos manualmente con cada cambio relevante. Ademas recibes una notificacion cada vez que hay una actualizacion." },
  { q: "Es segura mi informacion?", a: "Si. Toda la informacion esta cifrada y tu portal es completamente privado. Ningun otro cliente puede ver tus datos." },
  { q: "Cual es el coste del servicio?", a: "Dependiendo de tu patrimonio y necesidades, acordamos una estructura de honorarios transparente y sin letra pequena. Primera consulta gratuita." },
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroImageY = useTransform(scrollY, [0, 500], [0, -60])

  return (
    <div className="min-h-screen" style={{background: "#0D0D0D", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{position: "sticky", top: 0, zIndex: 50, background: "rgba(13,13,13,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 2rem"}}
      >
        <div style={{maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60}}>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div style={{width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700}}>W</div>
            <span style={{fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em"}}>WM Patrimonial</span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 32}}>
            {["#servicios", "#nosotros", "#faq", "#contacto"].map((href, i) => (
              <a key={href} href={href} style={{fontSize: 13, color: "rgba(255,255,255,0.5)", transition: "color 0.2s"}}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "#fff"}
                onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)"}
              >
                {["Servicios", "Nosotros", "FAQ", "Contacto"][i]}
              </a>
            ))}
          </div>
          <Link href="/login" style={{background: "#fff", color: "#000", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, transition: "opacity 0.2s"}}
            onMouseEnter={e => (e.target as HTMLElement).style.opacity = "0.85"}
            onMouseLeave={e => (e.target as HTMLElement).style.opacity = "1"}
          >
            Acceder
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} style={{maxWidth: 1200, margin: "0 auto", padding: "80px 2rem 60px", textAlign: "center", position: "relative"}}>
        <div style={{position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, transparent 70%)", pointerEvents: "none"}} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#22c55e", marginBottom: 24}}
        >
          <span style={{width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite"}} />
          Nuevo portal de cliente disponible
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 20}}
        >
          La nueva era de la<br />
          <span style={{background: "linear-gradient(135deg, #22c55e, #16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
            gestion patrimonial
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{fontSize: 18, color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.6}}
        >
          Accede a tu cartera en tiempo real. Recibe analisis exclusivos. Invierte con informacion clara y sin conflictos de interes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16}}
        >
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{background: "#22c55e", color: "#000", padding: "14px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, boxShadow: "0 0 30px rgba(34,197,94,0.3)"}}
          >
            Solicitar informacion gratuita
          </motion.a>
          <motion.div whileHover={{ scale: 1.03 }}>
            <Link href="/login" style={{border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "14px 28px", borderRadius: 10, fontSize: 14, fontWeight: 500, display: "inline-block"}}>
              Soy cliente →
            </Link>
          </motion.div>
        </motion.div>
        <p style={{fontSize: 12, color: "rgba(255,255,255,0.2)"}}>Primera consulta gratuita · Sin compromiso</p>

        {/* Hero preview card */}
        <motion.div
          style={{ y: heroImageY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div style={{marginTop: 60, background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, maxWidth: 700, margin: "60px auto 0", textAlign: "left", boxShadow: "0 40px 80px rgba(0,0,0,0.6)"}}>
            <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 20}}>
              <div style={{width: 10, height: 10, borderRadius: "50%", background: "#ef4444"}} />
              <div style={{width: 10, height: 10, borderRadius: "50%", background: "#f97316"}} />
              <div style={{width: 10, height: 10, borderRadius: "50%", background: "#22c55e"}} />
              <span style={{fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: 8}}>portal.wmpatrimonial.com</span>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16}}>
              {[{label: "Valor total", val: "€124.850", change: "+7,4%", color: "#22c55e"}, {label: "Rentab. YTD", val: "+7,4%", change: "+€8.640", color: "#22c55e"}, {label: "Perfil riesgo", val: "Moderado", change: "Revisado", color: "rgba(255,255,255,0.3)"}].map(s => (
                <div key={s.label} style={{background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14}}>
                  <p style={{fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em"}}>{s.label}</p>
                  <p style={{fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em"}}>{s.val}</p>
                  <p style={{fontSize: 11, color: s.color, marginTop: 4}}>{s.change}</p>
                </div>
              ))}
            </div>
            <div style={{background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14}}>
              <p style={{fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em"}}>Distribucion de cartera</p>
              <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                {[{l: "Renta variable", p: 45, c: "#3b82f6"}, {l: "Renta fija", p: 35, c: "#22c55e"}, {l: "Liquidez", p: 12, c: "#f97316"}, {l: "Alternativos", p: 8, c: "#a855f7"}].map(item => (
                  <div key={item.l} style={{display: "flex", alignItems: "center", gap: 10}}>
                    <span style={{fontSize: 11, color: "rgba(255,255,255,0.4)", width: 100, flexShrink: 0}}>{item.l}</span>
                    <div style={{flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2}}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.p}%` }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        style={{height: 4, background: item.c, borderRadius: 2}}
                      />
                    </div>
                    <span style={{fontSize: 11, color: "rgba(255,255,255,0.4)", width: 28, textAlign: "right"}}>{item.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "40px 2rem"}}>
        <div style={{maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0}}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{textAlign: "center", padding: "20px 0", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none"}}
            >
              <p style={{fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4}}>{s.value}</p>
              <p style={{fontSize: 12, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em"}}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section id="servicios" style={{maxWidth: 1200, margin: "0 auto", padding: "80px 2rem"}}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{textAlign: "center", marginBottom: 56}}
        >
          <p style={{fontSize: 12, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12}}>Servicios</p>
          <h2 style={{fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14}}>Todo lo que necesitas para gestionar tu patrimonio</h2>
          <p style={{fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto"}}>Un servicio completo, personalizado y accesible desde cualquier dispositivo.</p>
        </motion.div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16}}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ scale: 1.02, borderColor: `${f.color}30` }}
              style={{background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 22, cursor: "default", transition: "all 0.2s"}}
            >
              <div style={{width: 38, height: 38, borderRadius: 10, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: f.color, marginBottom: 14}}>
                {f.icon}
              </div>
              <h3 style={{fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em"}}>{f.title}</h3>
              <p style={{fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6}}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Por que nosotros */}
      <section id="nosotros" style={{background: "#111", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "80px 2rem"}}>
        <div style={{maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center"}}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{fontSize: 12, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16}}>Por que elegirnos</p>
            <h2 style={{fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 24}}>
              Independencia total.<br />
              <span style={{color: "rgba(255,255,255,0.25)"}}>Sin conflictos de interes.</span>
            </h2>
            <div style={{display: "flex", flexDirection: "column", gap: 0}}>
              {[
                {title: "100% independiente", desc: "Sin vinculacion a bancos ni entidades. Solo trabajo para ti."},
                {title: "Transparencia total", desc: "Comisiones claras. Rentabilidades reales. Sin sorpresas."},
                {title: "Portal 24/7", desc: "Tu cartera siempre disponible desde cualquier dispositivo."},
                {title: "Contacto directo", desc: "Hablas conmigo, no con un gestor de turno."},
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.05)"}}
                >
                  <div style={{width: 20, height: 20, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "#22c55e", marginTop: 2}}>✓</div>
                  <div>
                    <p style={{fontSize: 14, fontWeight: 600, marginBottom: 3}}>{item.title}</p>
                    <p style={{fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5}}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{display: "flex", flexDirection: "column", gap: 12}}
          >
            {[
              {icon: "◈", color: "#22c55e", title: "Actualizacion en tiempo real", desc: "Cada cambio en tu cartera se refleja inmediatamente en tu portal."},
              {icon: "◎", color: "#3b82f6", title: "Notificaciones inmediatas", desc: "Recibe un aviso cuando tu asesor publica algo relevante para ti."},
              {icon: "◇", color: "#a855f7", title: "Recomendaciones privadas", desc: "Solo tu puedes ver los productos que tu asesor te ha seleccionado."},
            ].map((card, i) => (
              <motion.div
                key={card.title}
                whileHover={{ borderColor: `${card.color}30`, scale: 1.01 }}
                style={{background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 18, display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.2s"}}
              >
                <div style={{width: 36, height: 36, borderRadius: 9, background: `${card.color}12`, border: `1px solid ${card.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: card.color, fontSize: 16}}>{card.icon}</div>
                <div>
                  <p style={{fontSize: 14, fontWeight: 600, marginBottom: 4}}>{card.title}</p>
                  <p style={{fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5}}>{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{maxWidth: 800, margin: "0 auto", padding: "80px 2rem"}}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{textAlign: "center", marginBottom: 48}}
        >
          <p style={{fontSize: 12, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12}}>FAQ</p>
          <h2 style={{fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12}}>Preguntas frecuentes</h2>
          <p style={{fontSize: 14, color: "rgba(255,255,255,0.35)"}}>
            No encuentras lo que buscas?{" "}
            <a href="#contacto" style={{color: "#22c55e"}}>Contactame.</a>
          </p>
        </motion.div>

        <div style={{display: "flex", flexDirection: "column", gap: 0}}>
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden"}}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", background: "none", border: "none", color: "#fff", cursor: "none", textAlign: "left"}}
              >
                <span style={{fontSize: 15, fontWeight: 600}}>{item.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{fontSize: 20, color: "rgba(255,255,255,0.3)", flexShrink: 0}}
                >+</motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{overflow: "hidden"}}
              >
                <p style={{fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, paddingBottom: 20}}>{item.a}</p>
              </motion.div>
            </motion.div>
          ))}
          <div style={{borderTop: "1px solid rgba(255,255,255,0.06)"}} />
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{padding: "0 2rem 80px"}}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{maxWidth: 1200, margin: "0 auto", background: "linear-gradient(135deg, #141414, #0f1f14)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 20, padding: "60px 48px", textAlign: "center", position: "relative", overflow: "hidden"}}
        >
          <div style={{position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, transparent 70%)", pointerEvents: "none"}} />
          <p style={{fontSize: 12, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16, position: "relative"}}>Empezar</p>
          <h2 style={{fontSize: "clamp(1.8rem, 4vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14, position: "relative"}}>
            Gestiona tu patrimonio<br />como merece.
          </h2>
          <p style={{fontSize: 15, color: "rgba(255,255,255,0.4)", marginBottom: 32, position: "relative"}}>Primera consulta gratuita. Sin compromiso.</p>
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{background: "#22c55e", color: "#000", padding: "16px 36px", borderRadius: 10, fontSize: 14, fontWeight: 700, display: "inline-block", boxShadow: "0 0 40px rgba(34,197,94,0.3)", position: "relative"}}
          >
            Solicitar consulta gratuita
          </motion.a>
          <p style={{fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 14, position: "relative"}}>Sin tarjeta de credito · Respondo en menos de 24h</p>
        </motion.div>
      </section>

      {/* Contacto */}
      <section id="contacto" style={{borderTop: "1px solid rgba(255,255,255,0.06)", padding: "80px 2rem"}}>
        <div style={{maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start"}}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{fontSize: 12, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16}}>Contacto</p>
            <h2 style={{fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14}}>Hablemos.</h2>
            <p style={{fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 32, maxWidth: 340}}>
              Sin compromiso. Primera consulta gratuita. Te respondo en menos de 24 horas.
            </p>
            <div style={{display: "flex", flexDirection: "column", gap: 0}}>
              {[
                {label: "Experiencia", val: "+10 anos en gestion patrimonial"},
                {label: "Clientes", val: "+50 familias e inversores"},
                {label: "Patrimonio", val: "+10M euros bajo gestion"},
              ].map(item => (
                <div key={item.label} style={{display: "flex", gap: 20, padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.05)"}}>
                  <span style={{fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", width: 80, flexShrink: 0, paddingTop: 2}}>{item.label}</span>
                  <span style={{fontSize: 13, color: "rgba(255,255,255,0.5)"}}>{item.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ContactFormWope />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 2rem"}}>
        <div style={{maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <div style={{width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700}}>W</div>
            <span style={{fontSize: 13, color: "rgba(255,255,255,0.25)", fontWeight: 500}}>WM Patrimonial</span>
          </div>
          <div style={{display: "flex", gap: 24}}>
            {[["#servicios","Servicios"],["#faq","FAQ"],["#contacto","Contacto"]].map(([href, label]) => (
              <a key={href} href={href} style={{fontSize: 12, color: "rgba(255,255,255,0.2)", transition: "color 0.2s"}}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
                onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.2)"}
              >{label}</a>
            ))}
            <Link href="/login" style={{fontSize: 12, color: "rgba(255,255,255,0.2)"}}>Acceso clientes</Link>
          </div>
          <span style={{fontSize: 12, color: "rgba(255,255,255,0.15)"}}>2026 WM Patrimonial</span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
