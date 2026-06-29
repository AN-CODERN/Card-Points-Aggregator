import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { BENEFITS_DATA, COMPARE_CATEGORIES } from '../lib/utils'

export default function Benefits() {
    const nav = useNavigate()
    const cards = useStore(s => s.cards)
    const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? '')

    const card = cards.find(c => c.id === selectedCardId)
    const bestForCat = (cat: string) => {
        if (!cards.length) return null
        return [...cards].sort((a, b) => b.rewardRate - a.rewardRate)[0]
    }

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                <h1 className="text-white font-bold text-lg">🎁 Card Benefits Hub</h1>
            </div>

            <div className="p-4 space-y-5">
                {cards.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">🎁</div>
                        <div className="text-gray-500 text-sm">Add a card to see its benefits</div>
                        <button onClick={() => nav('/add-card')} className="mt-3 text-primary-600 text-sm font-semibold hover:underline">Add Card →</button>
                    </div>
                ) : (
                    <>
                        {/* Card selector */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Card</label>
                            <select value={selectedCardId} onChange={e => setSelectedCardId(e.target.value)}
                                className="mt-2 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                                {cards.map(c => <option key={c.id} value={c.id}>{c.cardName} – {c.bank}</option>)}
                            </select>
                        </div>

                        {/* Lounge access highlight */}
                        {card && (
                            <div className="bg-gradient-to-r from-sky-600 to-blue-700 rounded-2xl p-4 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">✈️</span>
                                    <div>
                                        <div className="font-bold">Airport Lounge Access</div>
                                        <div className="text-sm opacity-80">{card.cardName} – {card.bank}</div>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="font-extrabold text-2xl">{card.loungeTotal - card.loungeUsed}</div>
                                        <div className="text-xs opacity-80">of {card.loungeTotal} remaining</div>
                                    </div>
                                </div>
                                <div className="mt-3 bg-white/10 rounded-xl p-2">
                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${card.loungeTotal ? ((card.loungeTotal - card.loungeUsed) / card.loungeTotal) * 100 : 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Benefits grid */}
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white mb-3">All Benefits</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {BENEFITS_DATA.map(b => (
                                    <div key={b.key} className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                        <div className="text-2xl mb-2">{b.icon}</div>
                                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{b.label}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{b.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Smart Card Comparison */}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">🏆 Smart Card Comparison</h2>
                    {cards.length < 1 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 text-gray-500 text-sm">
                            Add 2+ cards to compare
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {COMPARE_CATEGORIES.map(cc => {
                                const best = bestForCat(cc.cat)
                                return (
                                    <div key={cc.cat} className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                                        <span className="text-2xl w-10 text-center">{cc.icon}</span>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{cc.cat}</div>
                                            <div className="font-semibold text-sm text-gray-900 dark:text-white">{best ? best.cardName : '—'}</div>
                                        </div>
                                        {best && (
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-emerald-600">{best.rewardRate}% rewards</div>
                                                <div className="text-[10px] text-gray-400">{best.bank}</div>
                                            </div>
                                        )}
                                        <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 text-xs">★</div>
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
