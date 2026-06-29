import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatINR, getGreeting, CATEGORY_ICONS, CATEGORY_COLORS } from '../lib/utils'
import VirtualCard from '../components/ui/VirtualCard'
import StatCard from '../components/ui/StatCard'
import toast from 'react-hot-toast'

export default function Dashboard() {
    const nav = useNavigate()
    const {
        user, cards, transactions,
        totalPoints, totalCashback, totalSavings, totalLounge, pointsValue,
        darkMode, toggleDarkMode, notifications, addNotification,
    } = useStore()

    useEffect(() => {
        // Apply dark mode on mount
        document.documentElement.classList.toggle('dark', darkMode)
    }, [darkMode])

    useEffect(() => {
        // Proactive AI nudge on login
        if (cards.length === 0) {
            const already = notifications.some(n => n.title === 'Add Your First Card')
            if (!already) {
                setTimeout(() => toast('💳 Add your first card to start tracking rewards!', { icon: '🃏' }), 1500)
                addNotification({ id: Date.now().toString(), title: 'Add Your First Card', message: 'Tap + to add your credit or debit card', type: 'info', read: false, date: new Date().toISOString() })
            }
        }
        // Expiry nudge
        const pts = totalPoints()
        if (pts > 500) {
            toast(`🌟 You have ${pts} points worth ${formatINR(pointsValue())}! Redeem now.`, { duration: 4000 })
        }
    }, [])

    const recentTxns = [...transactions].slice(0, 5)
    const greeting = getGreeting()
    const unread = notifications.filter(n => !n.read).length

    // Best card suggestion
    const bestCard = cards.length > 0
        ? [...cards].sort((a, b) => b.rewardRate - a.rewardRate)[0]
        : null

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-brand-red p-5 pt-10 rounded-b-3xl shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <div>
                            <div className="text-white/80 text-xs">{greeting} 👋</div>
                            <div className="text-white font-bold text-base">{user?.name ?? 'User'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleDarkMode} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <button onClick={() => nav('/notifications')} className="relative w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            🔔
                            {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[9px] text-gray-900 font-bold flex items-center justify-center">{unread}</span>}
                        </button>
                        <button onClick={() => nav('/profile')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            👤
                        </button>
                    </div>
                </div>

                {/* Points value banner */}
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-white/70 text-xs">Total Points Worth</div>
                        <div className="text-white font-extrabold text-2xl">{formatINR(pointsValue())}</div>
                        <div className="text-white/70 text-xs">{totalPoints().toLocaleString()} points accumulated</div>
                    </div>
                    <button onClick={() => nav('/rewards')} className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-2 rounded-xl hover:bg-yellow-300 transition-colors">
                        Redeem →
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <StatCard icon="⭐" value={totalPoints().toLocaleString()} label="Total Points" accent="bg-primary-600" onClick={() => nav('/rewards')} />
                    <StatCard icon="💰" value={formatINR(totalCashback())} label="Cashback" accent="bg-emerald-500" />
                    <StatCard icon="🐷" value={formatINR(totalSavings())} label="Total Savings" accent="bg-amber-500" />
                    <StatCard icon="✈️" value={`${totalLounge()} visits`} label="Lounge Left" accent="bg-rose-500" onClick={() => nav('/benefits')} />
                </div>

                {/* AI Smart Tip */}
                {bestCard && (
                    <div className="bg-gradient-to-r from-violet-600 to-primary-600 rounded-2xl p-4 flex gap-3 items-center shadow-lg">
                        <span className="text-3xl">🤖</span>
                        <div className="flex-1">
                            <div className="text-white text-xs font-semibold">CardMitra AI Tip</div>
                            <div className="text-white/90 text-sm mt-0.5">
                                Use <strong>{bestCard.cardName}</strong> today for max rewards ({bestCard.rewardRate}% rate)
                            </div>
                        </div>
                        <button onClick={() => nav('/ai')} className="text-white/80 hover:text-white text-xs border border-white/30 rounded-lg px-2 py-1 flex-shrink-0">
                            Ask AI →
                        </button>
                    </div>
                )}

                {/* My Cards */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-gray-900 dark:text-white">My Cards</h2>
                        <button onClick={() => nav('/add-card')} className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">
                            ➕ Add Card
                        </button>
                    </div>
                    {cards.length === 0 ? (
                        <div onClick={() => nav('/add-card')} className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-primary-300 transition-colors">
                            <span className="text-4xl">💳</span>
                            <div className="text-gray-500 dark:text-gray-400 text-sm text-center">No cards yet.<br />Tap to add your first card!</div>
                        </div>
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                            {cards.map(c => (
                                <div key={c.id} onClick={() => nav(`/card/${c.id}`)} className="flex-shrink-0 w-52">
                                    <VirtualCard card={c} mini />
                                </div>
                            ))}
                            <button onClick={() => nav('/add-card')} className="flex-shrink-0 w-44 h-28 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary-300 hover:text-primary-400 transition-colors">
                                <span className="text-2xl">➕</span>
                                <span className="text-xs">Add Card</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { icon: '➕', label: 'Add Txn', path: '/add-transaction' },
                            { icon: '🎁', label: 'Benefits', path: '/benefits' },
                            { icon: '⭐', label: 'Rewards', path: '/rewards' },
                            { icon: '🏷️', label: 'Deals', path: '/deals' },
                            { icon: '🛎️', label: 'Support', path: '/care' },
                        ].map(a => (
                            <button key={a.path} onClick={() => nav(a.path)} className="flex flex-col items-center gap-1.5 bg-white dark:bg-gray-800 rounded-2xl py-3 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                                <span className="text-xl">{a.icon}</span>
                                <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                        <button onClick={() => nav('/transactions')} className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline">See All</button>
                    </div>
                    {recentTxns.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700">
                            <div className="text-3xl mb-2">📋</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">No transactions yet.<br />Add a transaction to start tracking rewards!</div>
                            <button onClick={() => nav('/add-transaction')} className="mt-3 text-primary-600 text-sm font-semibold hover:underline">Add Transaction →</button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentTxns.map(t => {
                                const card = cards.find(c => c.id === t.cardId)
                                return (
                                    <div key={t.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                                            {CATEGORY_ICONS[t.category] ?? '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{t.merchant}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${CATEGORY_COLORS[t.category]}`}>{t.category}</span>
                                                {card && <span className="text-[10px] text-gray-400 truncate">{card.cardName}</span>}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-bold text-sm text-gray-900 dark:text-white">{formatINR(t.amount)}</div>
                                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">+{t.pointsEarned} pts</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
