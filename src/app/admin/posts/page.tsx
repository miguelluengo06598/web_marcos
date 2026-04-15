import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

const CATEGORY_LABELS: Record<string, string> = {
  mercados: "Mercados", opinion: "Opinion", informe: "Informe", aviso: "Aviso", educacion: "Educacion",
}
const CATEGORY_COLORS: Record<string, string> = {
  mercados: "bg-blue-50 text-blue-700 border-blue-100",
  opinion: "bg-violet-50 text-violet-700 border-violet-100",
  informe: "bg-amber-50 text-amber-700 border-amber-100",
  aviso: "bg-red-50 text-red-600 border-red-100",
  educacion: "bg-emerald-50 text-emerald-700 border-emerald-100",
}

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Panel admin</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Noticias</h1>
          <p className="text-sm text-gray-400 mt-1">{posts?.length ?? 0} publicaciones</p>
        </div>
        <Link href="/admin/posts/nuevo"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all self-start">
          + Nueva publicacion
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {!posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">◈</div>
            <p className="font-semibold text-gray-900 mb-1">No hay publicaciones todavia</p>
            <p className="text-sm text-gray-400 mb-6">Crea tu primera noticia para tus clientes.</p>
            <Link href="/admin/posts/nuevo" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              Crear publicacion
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.map((post: any) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                {post.cover_url ? (
                  <img src={post.cover_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl">◈</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category] || "bg-gray-50 text-gray-500 border-gray-100"}`}>
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                    {post.published
                      ? <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Publicado</span>
                      : <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">Borrador</span>
                    }
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(post.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
