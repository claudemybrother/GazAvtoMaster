import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'

interface Msg { id: number; text: string }

export default function Notifications() {
  const [msgs, setMsgs] = useState<Msg[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const conn = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/notifications', { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build()

    conn.on('ReceiveNotification', (msg: string) => {
      const id = Date.now()
      setMsgs(p => [...p, { id, text: msg }])
      setTimeout(() => setMsgs(p => p.filter(m => m.id !== id)), 4000)
    })

    conn.start().catch(() => {/* ignore if backend not running */})
    return () => { conn.stop() }
  }, [])

  if (!msgs.length) return null
  return (
    <div className="notification-bar">
      {msgs.map(m => (
        <div key={m.id} className="notification">🔔 {m.text}</div>
      ))}
    </div>
  )
}
