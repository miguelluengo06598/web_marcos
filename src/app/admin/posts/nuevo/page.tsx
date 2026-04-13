'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { PostCategory } from '@/lib/types'

const CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'mercados', label: 'Mercados' },
  { value: 'opinion', label: 'Opinión' },
  { value: 'informe', label: 'Informe' },
  { value: 'aviso', label: 'Aviso' },
  { value: 'educacion', label: 'Educación' },
]

export default function NuevoPostPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'mercados' as PostCategory,
    published: false,
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  function update(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(publish: boolean) {
    if (!form.title || !form.content) {
      setError('El título y el contenido son obligatorios')
      return
    }
    setLoading(true)
    setError('')

    let cover_url = ''
    let pdf_url = ''

    if (coverFile) {
      const ext = coverFile.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { data } = await supabase.storage.from('post-covers').upload(path, coverFile)
      if (data) {
        const { data: url } = supabase.storage.from('post-covers').getPublicUrl(path)
        cover_url = url.publicUrl
      }
    }

    if (pdfFile) {
      const path = `${Date.now()}-${pdfFile.name}`
      const { data } = await supabase.storage.from('post-pdfs').upload(path, pdfFile)
      if (data) {
        const { data: url } = supabase.storage.from('post-pdfs').getPublicUrl(path)
        pdf_url = url.publicUrl
      }
    }

    const { error: err } = await supabase.from('posts').insert({
      ...form,
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
      cover_url: cover_url || null,
      pdf_url: pdf_url || null,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900">
          ← Volver
        </button>
        <h2 className="text-xl font-medium text-gray-900">Nueva publicación</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Título *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Ej: Cierre de mercados — abril 2026"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => update('category', cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  form.category === cat.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contenido *</label>
          <textarea
            value={form.content}
            onChange={e => update('content', e.target.value)}
            rows={8}
            placeholder="Escribe el contenido de la publicación..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagen de portada</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-200 file:text-xs file:bg-white hover:file:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">PDF adjunto</label>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setPdfFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-200 file:text-xs file:bg-white hover:file:bg-gray-50"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Guardar borrador
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
          >
            {loading ? 'Publicando...' : 'Publicar ahora'}
          </button>
        </div>
      </div>
    </div>
  )
}