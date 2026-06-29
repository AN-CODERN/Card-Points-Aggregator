import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatINR, CATEGORY_ICONS, CATEGORY_COLORS, BENEFITS_DATA } from '../lib/utils'
import VirtualCard from '../components/ui/VirtualCard'
import toast from 'react-hot-toast'

export default function CardDetail() {
    const { id } = useParams<{ id: string }>()
    const nav = useNavigate()
    const { cards, transactions, removeCard, blockCard } = useStore()
    const [tab, setTab] = useState<'overview' | 'transactions' | 'benefits'>('overview')

    const card = cards.find(c => c.id === id)
    if (!card) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="text-5xl">😕</div>
            <div className="text-gray-500">Card not found</div>
            <button onClick={() => nav('/dashboard')} className="text-primary-600 font-semibold hover:underline">← Back to Dashboard</button>
        </div>
    )

    const cardTxns = transactions.filter(t => t.cardId === id)
    const totalSpent = cardTxns.reduce((a, t) => a + t.amount, 0)
    const totalPts = cardTxns.reduce((a, t) => a + t.pointsEarned, 0)
    const totalCb = cardTxns.reduce((a, t) => a + t.cashbackEarned, 0)
    const totalSav = cardTxns.reduce((a, t) => a + t.savings, 0)

    // Month transactions
    const now = new Date()
    const mthTxns = cardTxns.filter(t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
    const mthSpent = mthTxns.reduce((a, t) => a + t.amount, 0)
    const mthPts = mthTxns.reduce((a, t) => a + t.pointsEarned, 0)

    const handleDelete = () => {
        if (window.confirm(`Remove ${card.cardName} from CardMitra?`)) {
            removeCard(card.id)
            toast.success(`${card.cardName} removed.`)
            nav('/dashboard')
        }
    }

    const handleBlock = () => {
        blockCard(card.id)
        toast.success(`${card.cardName} has been blocked!`)
    }

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-brand-red p-5 pt-10 rounded-b-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                    <div className="flex-1">
                        <div className="text-white font-bold">{card.cardName}</div>
                        <div className="text-white/70 text-xs">{card.bank} • {card.type.toUpperCase()}</div>
                    </div>
                    {card.isBlocked && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">BLOCKED</span>}
                </div>
                <VirtualCard card={card} />
            </div>

            {/* Quick stats */}
            <div className="mx-4 -mt-4 bg-white dark:bg-gray-800 rounded-2xl p-4 grid grid-cols-4 gap-2 shadow-lg border border-gray-100 dark:border-gray-700">
                {[
                    { label: 'Total Spent', value: formatINR(totalSpent), color: 'text-gray-900 dark:text-white' },
                    { label: 'Points', value: totalPts.toLocaleString(), color: 'text-primary-600' },
                    { label: 'Cashback', value: formatINR(totalCb), color: 'text-emerald-600' },
                    { label: 'Savings', value: formatINR(totalSav), color: 'text-amber-600' },
                ].map(s => (
                    <div key={s.label} className="text-center">
                        <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl p-1 border border-gray-100 dark:border-gray-700">
                {(['overview', 'transactions', 'benefits'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all ${tab === t ? 'bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="p-4 space-y-4">
                {/* ── OVERVIEW ── */}
                {tab === 'overview' && (
                    <>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">Card Info</h3>
                            {[
                                { label: 'Card Number', value: `XXXX XXXX XXXX ${card.cardNumber}` },
                                { label: 'Network', value: card.network.toUpperCase() },
                                { label: 'Expiry', value: card.expiry },
                                { label: 'Reward Rate', value: `${card.rewardRate}% per ₹100` },
                                { label: 'Cashback Rate', value: `${card.cashbackRate}%` },
                                { label: 'Lounge Access', value: `${card.loungeTotal - card.loungeUsed} / ${card.loungeTotal} visits left` },
                                { label: 'Added On', value: new Date(card.addedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                                { label: 'Status', value: card.isBlocked ? '🔴 Blocked' : '🟢 Active' },
                            ].map(r => (
                                <div key={r.label} className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-700 last:border-0">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{r.label}</span>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{r.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* This month */}
                        <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-4 text-white">
                            <div className="text-xs font-semibold opacity-80 mb-2">📅 This Month</div>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div><div className="font-extrabold text-lg">{mthTxns.length}</div><div className="text-[10px] opacity-70">Transactions</div></div>
                                <div><div className="font-extrabold text-lg">{formatINR(mthSpent)}</div><div className="text-[10px] opacity-70">Spent</div></div>
                                <div><div className="font-extrabold text-lg">{mthPts}</div><div className="text-[10px] opacity-70">Points</div></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            {!card.isBlocked && (
                                <button onClick={handleBlock} className="py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-2xl text-sm font-semibold hover:bg-amber-100 transition-colors">
                                    🔒 Block Card
                                </button>
                            )}
                            <button onClick={handleDelete} className={`py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-2xl text-sm font-semibold hover:bg-red-100 transition-colors ${card.isBlocked ? 'col-span-2' : ''}`}>
                                🗑️ Remove Card
                            </button>
                        </div>
                    </>
                )}

                {/* ── TRANSACTIONS ── */}
                {tab === 'transactions' && (
                    <div className="space-y-2">
                        {cardTxns.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-5xl mb-3">📋</div>
                                <div className="text-gray-500 text-sm">No transactions on this card yet</div>
                                <button onClick={() => nav('/add-transaction')} className="mt-3 text-primary-600 text-sm font-semibold hover:underline">Add Transaction →</button>
                            </div>
                        ) : cardTxns.map(t => (
                            <div key={t.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                                    {CATEGORY_ICONS[t.category] ?? '📦'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white truncate">{t.merchant}</div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${CATEGORY_COLORS[t.category]}`}>{t.category}</span>
                                        <span className="text-[10px] text-emerald-600">+{t.pointsEarned} pts</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="font-bold text-sm text-gray-900 dark:text-white">{formatINR(t.amount)}</div>
                                    <div className="text-[10px] text-gray-400">{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── BENEFITS ── */}
                {tab === 'benefits' && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl p-4 text-white">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">✈️</span>
                                <div>
                                    <div className="font-bold">Lounge Access</div>
                                    <div className="text-sm opacity-80">{card.loungeTotal - card.loungeUsed} visits remaining this year</div>
                                </div>
                                <div className="ml-auto text-right">
                                    <div className="font-extrabold text-2xl">{card.loungeTotal - card.loungeUsed}</div>
                                    <div className="text-xs opacity-70">of {card.loungeTotal}</div>
                                </div>
                            </div>
                            <div className="mt-3 bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: `${card.loungeTotal ? ((card.loungeTotal - card.loungeUsed) / card.loungeTotal) * 100 : 0}%` }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {BENEFITS_DATA.map(b => (
                                <div key={b.key} className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700">
                                    <div className="text-2xl mb-1">{b.icon}</div>
                                    <div className="font-semibold text-xs text-gray-900 dark:text-white">{b.label}</div>
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{b.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
