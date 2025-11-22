import { useMemo, useState } from 'react'

function CheckoutForm({ selection }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '', comment: '' })
  const [loading, setLoading] = useState(false)
  const total = useMemo(() => selection.total || 0, [selection])

  const handlePay = async () => {
    if (!selection.items?.length || total <= 0) return
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selection.items,
          patient_name: form.name,
          patient_email: form.email || undefined,
          patient_phone: form.phone || undefined,
          dob: form.dob || undefined,
          comment: form.comment || undefined,
        })
      })
      if (!res.ok) throw new Error('Failed to create session')
      const data = await res.json()
      window.location.href = data.url
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900">Your details</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
          <input className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mobile phone</label>
          <input className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date of birth (optional)</label>
          <input type="date" className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" value={form.dob} onChange={e=>setForm({...form, dob:e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Comment (optional)</label>
          <textarea rows="3" className="w-full rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500" value={form.comment} onChange={e=>setForm({...form, comment:e.target.value})} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div className="text-slate-600">Total</div>
        <div className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</div>
      </div>

      <button disabled={loading || total<=0} onClick={handlePay} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg">
        {loading ? 'Redirecting…' : 'Pay securely'}
      </button>
      <p className="text-xs text-slate-500 mt-2 text-center">Payments are processed securely by Stripe. We never store your card details.</p>
    </div>
  )
}

export default CheckoutForm