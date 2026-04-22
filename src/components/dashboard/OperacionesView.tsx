import type { Operation } from '@/lib/types'

interface Props {
  operations: Operation[]
  showProductName?: boolean
}

export default function OperacionesView({ operations, showProductName = false }: Props) {
  const totalOps = operations.length
  const wonOps = operations.filter(o => o.result === 'win')
  const lostOps = operations.filter(o => o.result === 'loss')
  const totalWonPoints = wonOps.reduce((sum, o) => sum + Number(o.points), 0)
  const totalLostPoints = lostOps.reduce((sum, o) => sum + Math.abs(Number(o.points)), 0)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Operaciones</h3>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          {totalOps} {totalOps === 1 ? 'operación' : 'operaciones'}
        </span>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 divide-x divide-gray-50 border-b border-gray-50">
        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 mb-1">Total operaciones</p>
          <p className="text-lg font-bold text-gray-900">{totalOps}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 mb-1">Puntos ganados</p>
          <p className="text-lg font-bold text-emerald-600">
            {totalOps === 0 ? '—' : `+${totalWonPoints.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-gray-400 mb-1">Puntos perdidos</p>
          <p className="text-lg font-bold text-red-500">
            {totalOps === 0 ? '—' : `-${totalLostPoints.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>

      {/* Operations list */}
      {totalOps === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-gray-400">No hay operaciones registradas</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          <div className={`px-5 py-2.5 grid gap-3 bg-gray-50 border-t border-gray-50 ${showProductName ? 'grid-cols-[1fr_90px_80px_70px_80px_80px]' : 'grid-cols-[1fr_80px_70px_80px_80px]'}`}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</span>
            {showProductName && <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Producto</span>}
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Tipo</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Puntos</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Precio</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Result.</span>
          </div>
          {operations.map(op => {
            const productName = op.client_products?.investment_products?.name
            return (
              <div
                key={op.id}
                className={`px-5 py-3.5 grid gap-3 hover:bg-gray-50/60 transition-colors ${showProductName ? 'grid-cols-[1fr_90px_80px_70px_80px_80px]' : 'grid-cols-[1fr_80px_70px_80px_80px]'}`}
              >
                <div>
                  <span className="text-sm text-gray-500">
                    {new Date(op.operated_at).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                  {op.notes && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{op.notes}</p>
                  )}
                </div>
                {showProductName && (
                  <span className="text-xs text-gray-600 truncate self-center">{productName || '—'}</span>
                )}
                <div className="self-center flex justify-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    op.type === 'buy' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {op.type === 'buy' ? 'Buy' : 'Sell'}
                  </span>
                </div>
                <span className={`text-sm font-semibold text-right self-center ${Number(op.points) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {Number(op.points) > 0 ? '+' : ''}{Number(op.points).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-gray-700 text-right self-center">
                  {Number(op.action_price).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className="self-center flex justify-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    op.result === 'win' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {op.result === 'win' ? 'WIN' : 'LOSS'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
