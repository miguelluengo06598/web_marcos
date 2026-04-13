import { createClient } from "@/lib/supabase/server"

const CATEGORY_LABELS: Record<string, string> = {
  mercados: "Mercados",
  opinion: "Opinion",
  informe: "Informe",
  aviso: "Aviso",
  educacion: "Educacion",
}

const CATEGORY_COLORS: Record<string, string> = {
  mercados: "bg-blue-100 text-blue-700",
  opinion: "bg-purple-100 text-purple-700",
  informe: "bg-amber-100 text-amber-700",
  aviso: "bg-red-100 text-red-700",
  educacion: "bg-green-100 text-green-700",
}

export default async function NoticiasPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-6">Noticias</h2>
      {!posts || posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          Todavia no hay publicaciones. Vuelve pronto.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {post.cover_url && (
                <img src={post.cover_url} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.published_at || post.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{post.content}</p>
                {post.pdf_url && (
                  <a href={post.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    Descargar PDF adjunto
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
