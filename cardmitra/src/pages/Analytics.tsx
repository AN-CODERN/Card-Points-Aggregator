import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatINR, CATEGORY_ICONS } from '../lib/utils'

type Period = 'week' | 'month' | 'year' | 'all'

export default function Analytics() {
    const nav = useNavigate()
    const { transactions, cards, totalPoints, totalCashback, totalSavings, pointsValue } = useStore()
    const [period, setPeriod] = useState<Period>('month')

    const now = new Date()
    const filterByPeriod = (txns: typeof transactions) => {
        if (period === 'all') return txns
        return txns.filter(t => {
            const d = new Date(t.date)
            if (period === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                return d >= weekAgo
            }
            if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            if (period === 'year') return d.getFullYear() === now.getFullYear()
            return true
        })
    }

    const filtered = filterByPeriod(transactions)
    const totalSpent = filtered.reduce((a, t) => a + t.amount, 0)
    const periodPts = filtered.reduce((a, t) => a + t.pointsEarned, 0)
    const periodCb = filtered.reduce((a, t) => a + t.cashbackEarned, 0)
    const periodSav = filtered.reduce((a, t) => a + t.savings, 0)

    // Category breakdown
    const byCat = filtered.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
    }, {} as Record<string, number>)
    const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1])
    const maxCat = catEntries[0]?.[1] || 1

    // Per-card stats
    const cardStats = cards.map(c => {
        const ctxns = filtered.filter(t => t.cardId === c.id)
        return {
            card: c,
            spent: ctxns.reduce((a, t) => a + t.amount, 0),
            points: ctxns.reduce((a, t) => a + t.pointsEarned, 0),
            cashback: ctxns.reduce((a, t) => a + t.cashbackEarned, 0),
            txnCount: ctxns.length,
        }
    }).sort((a, b) => b.spent - a.spent)

    // Most valuable card (highest cashback + pts value)
    const mostValuable = cardStats.reduce<typeof cardStats[0] | null>((best, c) => {
        const val = c.cashback + c.points * 0.25
        const bval = best ? best.cashback + best.points * 0.25 : -1
        return val > bval ? c : best
    }, null)

    // Net profit = cashback + points value - (assume ₹0 annual fee since not tracked)
    const netBenefit = periodCb + periodPts * 0.25

    const PERIODS: { key: Period; label: string }[] = [
        { key: 'week', label: 'Week' },
        { key: 'month', label: 'Month' },
        { key: 'year', label: 'Year' },
        { key: 'all', label: 'All' },
    ]

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/profile')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                <h1 className="text-white font-bold text-lg">📊 Savings Analytics</h1>
            </div>

            <div className="p-4 space-y-5">
                {/* Period selector */}
                <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 border border-gray-100 dark:border-gray-700 gap-1">
                    {PERIODS.map(p => (
                        <button key={p.key} onClick={() => setPeriod(p.key)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${period === p.key ? 'bg-emerald-600 text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* Top summary */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: '💸', label: 'Total Spent', value: formatINR(totalSpent), color: 'text-gray-900 dark:text-white' },
                        { icon: '💰', label: 'Net Benefit', value: formatINR(netBenefit), color: 'text-emerald-600' },
                        { icon: '⭐', label: 'Points Earned', value: periodPts.toLocaleString(), color: 'text-primary-600' },
                        { icon: '🐷', label: 'Total Saved', value: formatINR(periodSav), color: 'text-amber-600' },
                    ].map(s => (
                        <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="text-xl mb-1">{s.icon}</div>
                            <div className={`font-bold text-lg ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* All-time banner */}
                <div className="bg-gradient-to-r from-primary-700 to-violet-700 rounded-2xl p-4 text-white">
                    <div className="text-xs font-semibold opacity-80 mb-2">🏆 All-Time Total Benefit</div>
                    <div className="font-extrabold text-3xl">{formatINR(totalCashback() + pointsValue())}</div>
                    <div className="text-sm opacity-80 mt-1">= {formatINR(totalCashback())} cashback + {totalPoints().toLocaleString()} pts worth {formatINR(pointsValue())}</div>
                </div>

                {/* Category breakdown bar chart */}
                {catEntries.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
                        <div className="space-y-3">
                            {catEntries.map(([cat, amt]) => (
                                <div key={cat}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span>{CATEGORY_ICONS[cat] ?? '📦'}</span>
                                            <span className="font-medium">{cat}</span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{formatINR(amt)}</div>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-2 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(amt / maxCat) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                        {((amt / totalSpent) * 100).toFixed(1)}% of spending
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Most valuable card */}
                {mostValuable && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4">
                        <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">🏆 Most Valuable Card</div>
                        <div className="font-bold text-gray-900 dark:text-white">{mostValuable.card.cardName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{mostValuable.card.bank}</div>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            <div className="text-center"><div className="font-bold text-sm text-primary-600">{mostValuable.points}</div><div className="text-[10px] text-gray-500">Points</div></div>
                            <div className="text-center"><div className="font-bold text-sm text-emerald-600">{formatINR(mostValuable.cashback)}</div><div className="text-[10px] text-gray-500">Cashback</div></div>
                            <div className="text-center"><div className="font-bold text-sm text-amber-600">{mostValuable.txnCount}</div><div className="text-[10px] text-gray-500">Transactions</div></div>
                        </div>
                    </div>
                )}

                {/* Per-card table */}
                {cardStats.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Card-wise Performance</h3>
                        <div className="space-y-3">
                            {cardStats.map(cs => (
                                <div key={cs.card.id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white">{cs.card.cardName}</div>
                                            <div className="text-xs text-gray-500">{cs.card.bank} • {cs.txnCount} txns</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm">{formatINR(cs.spent)}</div>
                                            <div className="text-[10px] text-gray-400">spent</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 text-[10px]">
                                        <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-lg font-semibold">+{cs.points} pts</span>
                                        <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg font-semibold">+{formatINR(cs.cashback)} CB</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {transactions.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">📊</div>
                        <div className="text-gray-500 text-sm">No data yet. Add transactions to see analytics!</div>
                        <button onClick={() => nav('/add-transaction')} className="mt-3 text-primary-600 text-sm font-semibold hover:underline">Add Transaction →</button>
                    </div>
                )}
            </div>
        </div>
    )
}
