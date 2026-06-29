import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatINR, CATEGORY_ICONS, CATEGORY_COLORS } from '../lib/utils'

const FILTERS = ['All', 'Shopping', 'Travel', 'Food', 'Entertainment', 'Fuel', 'Utilities', 'Groceries', 'Other']

export default function Transactions() {
    const nav = useNavigate()
    const { transactions, cards } = useStore()
    const [filter, setFilter] = useState('All')

    const filtered = filter === 'All' ? transactions : transactions.filter(t => t.category === filter)
    const totalAmt = filtered.reduce((a, t) => a + t.amount, 0)
    const totalPts = filtered.reduce((a, t) => a + t.pointsEarned, 0)
    const totalCb = filtered.reduce((a, t) => a + t.cashbackEarned, 0)

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-primary-700 to-brand-red p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                <h1 className="text-white font-bold text-lg">Transaction History</h1>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 overflow-x-auto px-4 py-3 -mb-1">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-primary-600 text-white shadow' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                        {CATEGORY_ICONS[f] ?? ''} {f}
                    </button>
                ))}
            </div>

            {/* Summary bar */}
            <div className="mx-4 bg-white dark:bg-gray-800 rounded-2xl p-3 grid grid-cols-3 gap-2 text-center border border-gray-100 dark:border-gray-700">
                <div><div className="font-bold text-sm">{formatINR(totalAmt)}</div><div className="text-[10px] text-gray-500">Spent</div></div>
                <div><div className="font-bold text-sm text-primary-600">{totalPts.toLocaleString()}</div><div className="text-[10px] text-gray-500">Points</div></div>
                <div><div className="font-bold text-sm text-emerald-600">{formatINR(totalCb)}</div><div className="text-[10px] text-gray-500">Cashback</div></div>
            </div>

            <div className="p-4 space-y-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">📋</div>
                        <div className="text-gray-500 text-sm">No transactions{filter !== 'All' ? ` in ${filter}` : ''}</div>
                        <button onClick={() => nav('/add-transaction')} className="mt-3 text-primary-600 text-sm font-semibold hover:underline">Add Transaction →</button>
                    </div>
                ) : (
                    filtered.map(t => {
                        const card = cards.find(c => c.id === t.cardId)
                        return (
                            <div key={t.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                                        {CATEGORY_ICONS[t.category] ?? '📦'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{t.merchant}</div>
                                            <div className="font-bold text-sm text-gray-900 dark:text-white ml-2 flex-shrink-0">{formatINR(t.amount)}</div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg ${CATEGORY_COLORS[t.category]}`}>{t.category}</span>
                                            <span className="text-[10px] bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-lg">+{t.pointsEarned} pts</span>
                                            {t.cashbackEarned > 0 && <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg">+{formatINR(t.cashbackEarned)} CB</span>}
                                            {card && <span className="text-[10px] bg-gray-50 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-lg">•••{card.cardNumber}</span>}
                                        </div>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <div className="text-[10px] text-gray-400">{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                            <div className="text-[10px] text-emerald-600 font-medium">Saved {formatINR(t.savings)}</div>
                                        </div>
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
