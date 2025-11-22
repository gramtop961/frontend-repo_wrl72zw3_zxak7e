import { useCallback, useState } from 'react'
import Hero from './components/Hero'
import ServiceSelector from './components/ServiceSelector'
import CheckoutForm from './components/CheckoutForm'
import AdminDashboard from './components/AdminDashboard'
import SettingsPanel from './components/SettingsPanel'
import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  const [selection, setSelection] = useState({ items: [], total: 0 })
  const onChange = useCallback((data) => setSelection(data), [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-slate-900">SV Adult Health NP PC</Link>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#pay" className="text-slate-700 hover:text-slate-900">Pay</a>
            <Link to="/admin" className="text-slate-700 hover:text-slate-900">Admin</Link>
          </nav>
        </div>
      </header>
      <Hero />
      <main id="pay" className="container mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <ServiceSelector onChange={onChange} />
        <CheckoutForm selection={selection} />
      </main>
      <footer className="py-10 text-center text-slate-500 text-sm">Secure payments handled by Stripe • We never store your card details</footer>
    </div>
  )
}

function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-slate-900">SV Adult Health NP PC</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin" className="text-slate-700 hover:text-slate-900">Dashboard</Link>
            <Link to="/settings" className="text-slate-700 hover:text-slate-900">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        <AdminDashboard />
      </main>
    </div>
  )
}

function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold text-slate-900">SV Adult Health NP PC</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin" className="text-slate-700 hover:text-slate-900">Dashboard</Link>
            <Link to="/settings" className="text-slate-700 hover:text-slate-900">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        <SettingsPanel />
      </main>
    </div>
  )
}

function Success() {
  const params = new URLSearchParams(window.location.search)
  const session_id = params.get('session_id')
  const [state, setState] = useState({ status: 'loading', data: null })

  const confirm = async () => {
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/confirm-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id }) })
      const data = await res.json()
      setState({ status: 'done', data })
    } catch (e) {
      setState({ status: 'error', data: null })
    }
  }

  if (state.status === 'loading') confirm()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white p-8 rounded-xl shadow-sm ring-1 ring-slate-200 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment received</h2>
        <p className="text-slate-600">Thank you. Your payment has been processed. A receipt has been sent to your email if provided.</p>
        <div className="mt-6 text-left text-sm">
          {state.data && (
            <div>
              <div className="font-medium">Summary</div>
              <div className="mt-2 space-y-1">
                <div><span className="text-slate-500">Name:</span> {state.data.patient_name}</div>
                <div><span className="text-slate-500">Amount:</span> ${state.data.amount?.toFixed(2)}</div>
                <div><span className="text-slate-500">Status:</span> {state.data.status}</div>
                <div><span className="text-slate-500">Payment ID:</span> {state.data.payment_id}</div>
              </div>
            </div>
          )}
        </div>
        <a href="/" className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white">Back to home</a>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  )
}

export default App
