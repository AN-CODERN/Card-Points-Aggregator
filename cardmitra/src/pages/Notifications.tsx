import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const TYPE_STYLES = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'ℹ️', border: 'border-blue-100 dark:border-blue-800' },
    success: { bg: 'bg-green-50 dark:bg-green-900/20', icon: '✅', border: 'border-green-100 dark:border-green-800' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: '⚠️', border: 'border-amber-100 dark:border-amber-800' },
}

export default function Notifications() {
    const nav = useNavigate()
    const { notifications, markAllRead } = useStore()
    const unread = notifications.filter(n => !n.read).length

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-primary-700 to-brand-red p-5 pt-10 rounded-b-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                    <h1 className="text-white font-bold text-lg">🔔 Notifications</h1>
                </div>
                {unread > 0 && (
                    <button onClick={markAllRead} className="text-white/80 text-xs border border-white/30 px-3 py-1.5 rounded-xl hover:bg-white/10">
                        Mark all read
                    </button>
                )}
            </div>

            <div className="p-4 space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-3">🔕</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</div>
                    </div>
                ) : (
                    notifications.map(n => {
                        const s = TYPE_STYLES[n.type] ?? TYPE_STYLES.info
                        return (
                            <div key={n.id} className={`${s.bg} ${s.border} border rounded-2xl p-4 flex gap-3 items-start ${!n.read ? 'ring-1 ring-primary-300 dark:ring-primary-700' : ''}`}>
                                <span className="text-xl flex-shrink-0">{s.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{n.title}</div>
                                        {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{n.message}</div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        {new Date(n.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
