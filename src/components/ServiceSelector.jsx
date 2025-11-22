import { useEffect, useState } from 'react'

function ServiceSelector({ onChange }) {
  const [services, setServices] = useState([])
  const [customAmount, setCustomAmount] = useState('')
  const [selected, setSelected] = useState({})

  useEffect(() => {
    const load = async () => {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/services`)
      const data = await res.json()
      setServices(data)
    }
    load()
  }, [])

  useEffect(() => {
    const items = []
    let total = 0
    for (const id in selected) {
      if (selected[id]) {
        const svc = services.find(s => s._id === id)
        if (svc) {
          items.push({ name: svc.name, price: svc.price, quantity: 1 })
          total += svc.price
        }
      }
    }
    if (customAmount && Number(customAmount) > 0) {
      items.push({ name: 'Custom amount', price: Number(customAmount), quantity: 1 })
      total += Number(customAmount)
    }
    onChange({ items, total })
  }, [selected, customAmount, services, onChange])

  const toggle = (id) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900">Services</h3>
      <p className="text-sm text-slate-600 mb-4">Select one or more services</p>
      <div className="grid md:grid-cols-2 gap-3">
        {services.map(s => (
          <label key={s._id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 cursor-pointer">
            <input type="checkbox" checked={!!selected[s._id]} onChange={() => toggle(s._id)} />
            <div className="flex-1">
              <div className="text-slate-900 font-medium">{s.name}</div>
              <div className="text-slate-500 text-sm">${s.price.toFixed(2)}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Other amount</label>
        <input
          type="number"
          value={customAmount}
          onChange={e => setCustomAmount(e.target.value)}
          placeholder="Enter custom amount"
          className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  )
}

export default ServiceSelector