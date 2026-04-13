import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const CATEGORY_LABELS: Record<string, string> = {
  mercados: 'Mercados',
  opinion: 'Opinión',
  informe: 'Informe',
  aviso: 'Aviso',
  educacion: 'Educación',
}

const CATEGORY_COLORS: Record<string, string> = {
  mercados: 'bg-blue-100 text-blue-700',
  opinion: 'bg-purple-100 text-purple-700',
  informe: 'bg-amber-100 text-amber-700',
  aviso: 'bg-red-100 text-red-700',
  educacion: 'bg-green-100 text-green-700',
}

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-900">Noticias</h2>
        <Link
          href="/admin/posts/nuevo"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          + Nueva publicación
        </Link>
      </div>

      <div className="space-y-3">
        {!posts || posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
            No hay publicaciones todavía.
          </div>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              {post.cover_url && (
                <img src={post.cover_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-600'}`}>
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  {post.published
                    ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Publicado</span>
                    : <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Borrador</span>
                  }
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(post.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}