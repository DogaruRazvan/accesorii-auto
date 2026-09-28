import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types"
import { useEffect, useState } from "react"

const EawbOrder = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const refresh = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/admin/orders/${order.id}/eawb`, { credentials: "include" })
      if (!response.ok) throw new Error("Registrul eAWB nu poate fi încărcat.")
      setResult(await response.json())
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }
  useEffect(() => { void refresh() }, [order.id, order.fulfillments?.length])
  if (!result?.enabled && !error) return null
  return (
    <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Livrare eAWB</h2>
        <button className="border rounded px-3 py-1" onClick={refresh} disabled={loading}>{loading ? "Se încarcă…" : "Actualizează"}</button>
      </div>
      {error && <p role="alert" className="text-ui-fg-error">{error}</p>}
      {!result?.booking ? <p>AWB-ul se emite din „Fulfill items”, după activarea emiterii eAWB. Costul se achită din wallet-ul magazinului.</p> : (
        <>
          <p>Stare emitere: {result.booking.status}. {result.booking.carrier_status || ""}</p>
          {result.booking.awb && <p>AWB: {result.booking.awb}</p>}
          <div className="flex gap-4">
            {result.booking.label_url && <a href={result.booking.label_url} target="_blank" rel="noreferrer" className="text-ui-fg-interactive">Descarcă eticheta</a>}
            {result.booking.track_url && <a href={result.booking.track_url} target="_blank" rel="noreferrer" className="text-ui-fg-interactive">Urmărește coletul</a>}
          </div>
          {result.booking.upstream_unavailable && <p>eAWB nu răspunde momentan. AWB-ul salvat rămâne disponibil.</p>}
          {["pending", "uncertain", "rejected"].includes(result.booking.status) && <p>Verificați în contul eAWB comanda cu referința {order.id}. Emiterea repetată este blocată pentru a evita plata unui AWB duplicat. Urmați procedura de reconciliere din documentația integrării.</p>}
        </>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({ zone: "order.details.after" })
export default EawbOrder
