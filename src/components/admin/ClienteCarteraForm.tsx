"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ASSET_LABELS: Record<string, string> = {
  renta_variable: "Renta variable",
  renta_fija: "Renta fija",
  liquidez: "Liquidez",
  alternativo: "Alternativo",
}

const RISK_LABELS: Record<string, string> = {
  conservador: "Conservador",
  moderado: "Moderado",
  agresivo: "Agresivo",
}

interface Props {
  clienteId: string
  portfolio: any
}

export default function ClienteCarteraForm({ clienteId, portfolio }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [totalValue, setTotalValue] = useState(portfolio?.total_value?.toString() || "0")
  const [ytdReturn, setYtdReturn] = useState(portfolio?.ytd_return?.toString() || "0")
  const [riskProfile, setRiskProfile] = useState(portfolio?.risk_profile || "moderado")
  const [notes, setNotes] = useState(portfolio?.notes || "")
  const [positions, setPositions] = useState(portfolio?.portfolio_positions || [])

  function addPosition() {
    setPositions((prev: any[]) => [...prev, {
      asset_name: "",
      asset_type: "renta_variable",
      value: 0,
      weight_pct: 0,
      return_pct: 0,
      isin: "",
    }])
  }

  function updatePosition(index: number, field: string, value: any) {
    setPositions((prev: any[]) => prev.map((p: any, i: number) => i === index ? { ...p, [field]: value } : p))
  }

  function removePosition(index: number) {
    setPositions((prev: any[]) => prev.filter((_: any, i: number) => i !== index))
  }

  async function handleSave() {
    setLoading(true)
    setSaved(false)

    const res = await fetch("/api/admin/cartera", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portfolioId: portfolio?.id || null,
        clienteId,
        totalValue: parseFloat(totalValue),
        ytdReturn: parseFloat(ytdReturn),
        riskProfile,
        notes,
        positions,
      }),
    })

    if (res.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Valor total (euro)</label>
          <input
            type="number"
            value={totalValue}
            onChange={e => setTotalValue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Rentabilidad YTD (%)</label>
          <input
            type="number"
            step="0.01"
            value={ytdReturn}
            onChange={e => setYtdReturn(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Perfil de riesgo</label>
          <select
            value={riskProfile}
            onChange={e => setRiskProfile(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {Object.entries(RISK_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Notas internas</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="Observaciones sobre la cartera..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-gray-500">Posiciones</label>
          <button
            onClick={addPosition}
            className="text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-2 py-1 rounded-lg"
          >
            + Anadir posicion
          </button>
        </div>

        {positions.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
            Sin posiciones. Pulsa Anadir posicion para empezar.
          </p>
        ) : (
          <div className="space-y-2">
            {positions.map((pos: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="col-span-3 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Nombre activo"
                  value={pos.asset_name || ""}
                  onChange={e => updatePosition(i, "asset_name", e.target.value)}
                />
                <select
                  className="col-span-2 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                  value={pos.asset_type || "renta_variable"}
                  onChange={e => updatePosition(i, "asset_type", e.target.value)}
                >
                  {Object.entries(ASSET_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <input
                  className="col-span-2 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Valor euro"
                  type="number"
                  value={pos.value || ""}
                  onChange={e => updatePosition(i, "value", parseFloat(e.target.value))}
                />
                <input
                  className="col-span-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="% peso"
                  type="number"
                  value={pos.weight_pct || ""}
                  onChange={e => updatePosition(i, "weight_pct", parseFloat(e.target.value))}
                />
                <input
                  className="col-span-1 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="% rent"
                  type="number"
                  value={pos.return_pct || ""}
                  onChange={e => updatePosition(i, "return_pct", parseFloat(e.target.value))}
                />
                <input
                  className="col-span-2 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="ISIN opcional"
                  value={pos.isin || ""}
                  onChange={e => updatePosition(i, "isin", e.target.value)}
                />
                <button
                  onClick={() => removePosition(i)}
                  className="col-span-1 text-red-400 hover:text-red-600 text-xs text-center"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-colors"
        >
          {loading ? "Guardando..." : "Guardar cartera"}
        </button>
        {saved && (
          <span className="text-sm text-green-600">Guardado correctamente</span>
        )}
      </div>
    </div>
  )
}
