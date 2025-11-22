import { useEffect, useMemo, useState } from 'react'

function useAdminToken() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')
  const login = async (username, password) => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(`${base}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    if (!res.ok) throw new Error('Invalid credentials')
    const data = await res.json()
    localStorage.setItem('adminToken', data.token)
    setToken(data.token)
  }
  const logout = () => { localStorage.removeItem('adminToken'); setToken('') }
  return { token, login, logout }
}

function AdminDashboard() {
  const { token, login, logout } = useAdminToken()
  const [auth, setAuth] = useState({ username: '', password: '' })
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0 })
  const [filters, setFilters] = useState({ q: '', service: '', start_date: '', end_date: '' })

  const authedFetch = async (url) => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(`${base}${url}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error('Request failed')
    return res.json()
  }

  useEffect(() => {
    if (!token) return
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v))
    authedFetch(`/api/admin/payments?${params.toString()}`).then(data => {
      setPayments(data.items)
      setStats(data.stats)
    }).catch(()=>{})
  }, [token, filters])

  const handleExport = async () => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(`${base}/api/admin/payments/export`, { headers: { Authorization: `Bearer ${token}` } })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'payments.csv'; a.click(); URL.revokeObjectURL(url)
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <input placeholder="Username" className="w-full mb-3 rounded-lg border-slate-300" value={auth.username} onChange={e=>setAuth({...auth, username:e.target.value})} />
        <input type="password" placeholder="Password" className="w-full mb-3 rounded-lg border-slate-300" value={auth.password} onChange={e=>setAuth({...auth, password:e.target.value})} />
        <button onClick={() => login(auth.username, auth.password)} className="w-full bg-blue-600 text-white py-2 rounded-lg">Sign in</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
        <button onClick={logout} className="text-slate-500 hover:text-slate-700">Sign out</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-200">
          <div className="text-slate-500">Collected today</div>
          <div className="text-2xl font-semibold">${stats.today.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-200">
          <div className="text-slate-500">This week</div>
          <div className="text-2xl font-semibold">${stats.week.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-200">
          <div className="text-slate-500">This month</div>
          <div className="text-2xl font-semibold">${stats.month.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-200">
        <div className="grid md:grid-cols-5 gap-3 mb-4">
          <input placeholder="Search name, email, phone" className="rounded-lg border-slate-300" value={filters.q} onChange={e=>setFilters({...filters, q:e.target.value})} />
          <input type="date" className="rounded-lg border-slate-300" value={filters.start_date} onChange={e=>setFilters({...filters, start_date:e.target.value})} />
          <input type="date" className="rounded-lg border-slate-300" value={filters.end_date} onChange={e=>setFilters({...filters, end_date:e.target.value})} />
          <input placeholder="Filter by service" className="rounded-lg border-slate-300" value={filters.service} onChange={e=>setFilters({...filters, service:e.target.value})} />
          <button onClick={handleExport} className="bg-slate-900 text-white rounded-lg">Export CSV</button>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Patient</th>
                <th className="py-2 pr-4">Services</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Card</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="py-2 pr-4 whitespace-nowrap">{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</td>
                  <td className="py-2 pr-4">{p.patient_name}<div className="text-slate-500">{p.patient_email} {p.patient_phone}</div></td>
                  <td className="py-2 pr-4">{(p.services||[]).map(s=>`${s.name} x${s.quantity||1}`).join(', ')}</td>
                  <td className="py-2 pr-4 font-medium">${p.amount?.toFixed(2)}</td>
                  <td className="py-2 pr-4">{p.status}{p.refunded ? ' (refunded)' : ''}</td>
                  <td className="py-2 pr-4">{p.card_last4 ? `•••• ${p.card_last4}` : ''}</td>
                  <td className="py-2 pr-4 text-right"><RefundButton token={token} id={p._id} onDone={() => setFilters({ ...filters })} disabled={p.refunded} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RefundButton({ token, id, onDone, disabled }) {
  const [loading, setLoading] = useState(false)
  const doRefund = async () => {
    setLoading(true)
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      await fetch(`${base}/api/admin/payments/${id}/mark-refunded`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      onDone && onDone()
    } finally {
      setLoading(false)
    }
  }
  return <button disabled={disabled || loading} onClick={doRefund} className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50">Mark refunded</button>
}

export default AdminDashboard
