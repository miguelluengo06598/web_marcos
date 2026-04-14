import Link from "next/link"
import ContactForm from "./ContactForm"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto border-b border-white/5">
        <span className="font-semibold text-white tracking-tight">WM Patrimonial</span>
        <div className="flex items-center gap-6">
          <a href="#servicios" className="text-sm text-white/50 hover:text-white transition-colors">Servicios</a>
          <a href="#contacto" className="text-sm text-white/50 hover:text-white transition-colors">Contacto</a>
          <Link href="/login" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
            Acceder
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-28 pb-24 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
          <span className="text-xs text-white/60">Asesoramiento independiente y sin conflictos de interes</span>
        </div>
        <h1 className="text-6xl font-semibold tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
          Tu patrimonio,<br />
          <span className="text-white/30">gestionado con criterio</span>
        </h1>
        <p className="text-lg text-white/40 mb-10 max-w-xl mx-auto leading-relaxed">
          Accede a tu cartera en tiempo real. Recibe analisis del mercado. Invierte con informacion clara y sin letra pequena.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="#contacto" className="bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
            Solicitar informacion
          </a>
          <Link href="/login" className="border border-white/10 text-white/60 px-6 py-3 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors">
            Soy cliente
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
          {[
            { value: "+10 anos", label: "de experiencia" },
            { value: "+50", label: "clientes activos" },
            { value: "10M+", label: "patrimonio gestionado" },
            { value: "8,2%", label: "rentabilidad media" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/3 border border-white/5 rounded-xl p-5 text-center">
              <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="servicios" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Que ofrezco</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">Un servicio completo de gestion patrimonial, adaptado a tu situacion y objetivos.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: "◎", title: "Planificacion patrimonial", desc: "Diseno de estrategias de inversion adaptadas a tus objetivos vitales y horizonte temporal." },
              { icon: "◈", title: "Gestion de carteras", desc: "Seleccion y seguimiento de activos con criterios de rentabilidad y control riguroso del riesgo." },
              { icon: "◇", title: "Asesoramiento continuo", desc: "Acceso directo a tu asesor, actualizaciones de mercado y portal personal disponible 24/7." },
            ].map((s) => (
              <div key={s.title} className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-5 text-lg">{s.icon}</div>
                <h3 className="font-medium text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Sin conflictos de interes.<br />
                <span className="text-white/30">Solo tu patrimonio importa.</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Sin vinculacion a ninguna entidad financiera. Recomiendo lo que es mejor para ti.",
                  "Transparencia total en comisiones y rentabilidades. Sin sorpresas.",
                  "Portal personal con tu cartera actualizada en tiempo real. Disponible 24/7.",
                  "Atencion directa y personalizada. No eres un numero.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-start">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-sm text-white/50 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/3 border border-white/5 rounded-2xl p-8 space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/30 mb-1">Valor total cartera</p>
                <p className="text-2xl font-semibold">124.850</p>
                <p className="text-xs text-green-400 mt-0.5">+7,4% este ano</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Renta variable</p>
                  <p className="text-lg font-semibold">45%</p>
                  <div className="mt-2 h-1 bg-white/10 rounded-full">
                    <div className="h-1 bg-blue-400 rounded-full" style={{width: "45%"}}></div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-1">Renta fija</p>
                  <p className="text-lg font-semibold">35%</p>
                  <div className="mt-2 h-1 bg-white/10 rounded-full">
                    <div className="h-1 bg-green-400 rounded-full" style={{width: "35%"}}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/20 text-center">Vista previa del portal de cliente</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-4xl font-semibold tracking-tight mb-4 relative">
              Empieza a gestionar<br />tu patrimonio hoy
            </h2>
            <p className="text-white/40 text-sm mb-8">Primera consulta gratuita y sin compromiso.</p>
            <a href="#contacto" className="bg-white text-black px-8 py-3 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors inline-block">
              Solicitar consulta gratuita
            </a>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24 border-t border-white/5">
        <div className="max-w-lg mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">Hablemos</h2>
            <p className="text-sm text-white/40">Sin compromiso. Te respondo en menos de 24 horas.</p>
          </div>
          <ContactForm />
        </div>
      </section>

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
