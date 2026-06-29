import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/transactions', icon: '📋', label: 'History' },
    { path: '/benefits', icon: '🎁', label: 'Benefits' },
    { path: '/rewards', icon: '⭐', label: 'Rewards' },
    { path: '/ai', icon: '🤖', label: 'AI' },
]

export default function BottomNav() {
    const nav = useNavigate()
    const { pathname } = useLocation()

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 safe-area-pb">
            <div className="flex items-center justify-around px-2 py-1">
                {TABS.map(tab => {
                    const active = pathname.startsWith(tab.path)
                    return (
                        <button
                            key={tab.path}
                            onClick={() => nav(tab.path)}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${active
                                    ? 'bg-primary-50 dark:bg-primary-900/30 scale-110'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className={`text-xl ${active ? '' : 'opacity-60'}`}>{tab.icon}</span>
                            <span className={`text-[10px] font-medium ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
