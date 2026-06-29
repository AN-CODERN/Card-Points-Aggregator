import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatINR } from '../lib/utils'
import toast from 'react-hot-toast'

export default function Profile() {
    const nav = useNavigate()
    const { user, logout, toggleDarkMode, darkMode, cards, transactions, totalPoints, totalCashback, pointsValue } = useStore()
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(user?.name ?? '')

    const handleSave = () => {
        useStore.setState(s => ({ user: s.user ? { ...s.user, name } : null }))
        setEditing(false)
        toast.success('Profile updated!')
    }

    const handleLogout = () => {
        logout()
        nav('/auth')
        toast.success('Logged out successfully')
    }

    const STATS = [
        { label: 'Cards', value: cards.length, icon: '💳' },
        { label: 'Transactions', value: transactions.length, icon: '📋' },
        { label: 'Total Points', value: totalPoints().toLocaleString(), icon: '⭐' },
        { label: 'Points Worth', value: formatINR(pointsValue()), icon: '💎' },
        { label: 'Cashback', value: formatINR(totalCashback()), icon: '💰' },
        { label: 'Member Since', value: user ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—', icon: '📅' },
    ]

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-primary-700 to-brand-red p-5 pt-10 rounded-b-3xl">
                <div className="flex items-center gap-3 mb-1">
                    <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                    <h1 className="text-white font-bold text-lg">Profile</h1>
                </div>
                <div className="flex flex-col items-center mt-4">
                    <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-4xl font-bold text-white">
                        {user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    {editing ? (
                        <div className="flex gap-2 mt-3">
                            <input value={name} onChange={e => setName(e.target.value)}
                                className="px-3 py-2 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white" />
                            <button onClick={handleSave} className="bg-white text-primary-700 font-bold text-sm px-3 py-2 rounded-xl">Save</button>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center gap-2">
                            <div className="text-white font-bold text-xl">{user?.name}</div>
                            <button onClick={() => setEditing(true)} className="text-white/60 hover:text-white text-sm">✏️</button>
                        </div>
                    )}
                    <div className="text-white/70 text-sm mt-1">{user?.email}</div>
                    {user?.phone && <div className="text-white/60 text-xs mt-0.5">{user.phone}</div>}
                </div>
            </div>

            <div className="p-4 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {STATS.map(s => (
                        <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-700">
                            <div className="text-xl">{s.icon}</div>
                            <div className="font-bold text-sm text-gray-900 dark:text-white mt-1">{s.value}</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Settings */}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">Settings</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {[
                            { icon: '🌙', label: 'Dark Mode', action: toggleDarkMode, trailing: <div className={`w-10 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}`}><div className={`w-5 h-5 bg-white rounded-full mt-0.5 shadow transition-transform ${darkMode ? 'translate-x-4 ml-0.5' : 'ml-0.5'}`} /></div> },
                            { icon: '🔔', label: 'Notifications', action: () => nav('/notifications') },
                            { icon: '🛡️', label: 'Privacy & Security', action: () => toast('Coming soon!') },
                            { icon: '💳', label: 'Manage Cards', action: () => nav('/add-card') },
                            { icon: '🌐', label: 'Language', action: () => toast('Multi-language coming soon!') },
                            { icon: 'ℹ️', label: 'About CardMitra', action: () => toast('CardMitra v1.0 – Your Rewards Expert') },
                        ].map((item, i, arr) => (
                            <button key={item.label} onClick={item.action}
                                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${i < arr.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}>
                                <span className="text-xl w-8">{item.icon}</span>
                                <span className="flex-1 font-medium text-sm text-gray-900 dark:text-white">{item.label}</span>
                                {item.trailing ?? <span className="text-gray-400">›</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick nav */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: '🏷️', label: 'Deals & Offers', path: '/deals' },
                        { icon: '🛎️', label: 'Customer Care', path: '/care' },
                    ].map(item => (
                        <button key={item.path} onClick={() => nav(item.path)}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <span className="text-2xl">{item.icon}</span>
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <button onClick={handleLogout}
                    className="w-full py-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    🚪 Logout
                </button>
            </div>
        </div>
    )
}
