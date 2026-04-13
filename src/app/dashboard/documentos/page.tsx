import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DocumentosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: documentos } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-6">Documentos</h2>
      {!documentos || documentos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
          No hay documentos disponibles todavia.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {documentos.map((doc: any) => (
              <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-xs font-medium text-red-600">
                    PDF
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(doc.created_at).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
