import { useEffect, useState } from 'react'

function SettingsPanel() {
  const [settings, setSettings] = useState({ practice_name: '', practice_address: '', practice_phone: '', practice_email: '' })
  const token = localStorage.getItem('adminToken') || ''
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${base}/api/settings`).then(r=>r.json()).then(setSettings).catch(()=>{})
  }, [])

  const save = async () => {
    await fetch(`${base}/api/admin/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ practice_name: settings.practice_name, practice_address: settings.practice_address, practice_phone: settings.practice_phone, practice_email: settings.practice_email }) })
    alert('Saved')
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-semibold">Settings</h3>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <input className="rounded-lg border-slate-300" placeholder="Practice name" value={settings.practice_name||''} onChange={e=>setSettings({...settings, practice_name:e.target.value})} />
        <input className="rounded-lg border-slate-300" placeholder="Practice address" value={settings.practice_address||''} onChange={e=>setSettings({...settings, practice_address:e.target.value})} />
        <input className="rounded-lg border-slate-300" placeholder="Practice phone" value={settings.practice_phone||''} onChange={e=>setSettings({...settings, practice_phone:e.target.value})} />
        <input type="email" className="rounded-lg border-slate-300" placeholder="Notification email" value={settings.practice_email||''} onChange={e=>setSettings({...settings, practice_email:e.target.value})} />
      </div>
      <div className="mt-4 text-right">
        <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button>
      </div>
    </div>
  )
}

export default SettingsPanel
