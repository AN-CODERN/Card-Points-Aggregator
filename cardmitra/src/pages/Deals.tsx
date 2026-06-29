import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { DEALS_DATA, formatINR } from '../lib/utils'
import toast from 'react-hot-toast'

const CATS = ['all', 'electronics', 'health', 'fashion', 'ecommerce']

export default function Deals() {
    const nav = useNavigate()
    const cards = useStore(s => s.cards)
    const [cat, setCat] = useState('all')
    const [selectedCard, setSelectedCard] = useState(cards[0]?.id ?? '')

    const card = cards.find(c => c.id === selectedCard)
    const filtered = cat === 'all' ? DEALS_DATA : DEALS_DATA.filter(d => d.category === cat)

    const getExtra = (baseDiscount: number) =>
        card ? Math.min(baseDiscount + card.rewardRate, baseDiscount + 10) : baseDiscount

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                <h1 className="text-white font-bold text-lg">🏷️ Deals &amp; Offers</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Card selector */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 mb-1">Select card to see extra benefits</div>
                    {cards.length === 0 ? (
                        <div className="text-sm text-amber-600">
                            ⚠️ <button onClick={() => nav('/add-card')} className="underline">Add a card</button> to unlock extra deals
                        </div>
                    ) : (
                        <select value={selectedCard} onChange={e => setSelectedCard(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                            {cards.map(c => <option key={c.id} value={c.id}>{c.cardName} – {c.bank}</option>)}
                        </select>
                    )}
                </div>

                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
                    {CATS.map(c => (
                        <button key={c} onClick={() => setCat(c)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all ${cat === c ? 'bg-rose-600 text-white shadow' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>
                            {c === 'all' ? 'All Deals' : c}
                        </button>
                    ))}
                </div>

                {/* Deals */}
                <div className="space-y-3">
                    {filtered.map(deal => {
                        const extra = getExtra(deal.discount)
                        const saving = deal.price > 0 ? deal.originalPrice - deal.price : null
                        return (
                            <div key={deal.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="p-4 flex gap-4 items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-4xl flex-shrink-0">
                                        {deal.logo}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm text-gray-900 dark:text-white">{deal.brand}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{deal.desc}</div>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            <span className="text-[10px] bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-semibold px-2 py-0.5 rounded-lg">
                                                {extra}% off
                                            </span>
                                            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-lg">
                                                +{deal.cashback}% cashback
                                            </span>
                                            {card && (
                                                <span className="text-[10px] bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold px-2 py-0.5 rounded-lg">
                                                    Extra {card.rewardRate}% via {card.cardName.slice(0, 10)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        {deal.price > 0 ? (
                                            <>
                                                <div className="font-extrabold text-sm text-gray-900 dark:text-white">{formatINR(deal.price)}</div>
                                                <div className="text-xs line-through text-gray-400">{formatINR(deal.originalPrice)}</div>
                                                {saving && <div className="text-[10px] text-emerald-600 font-bold">Save {formatINR(saving)}</div>}
                                            </>
                                        ) : (
                                            <div className="text-xs font-bold text-primary-600 dark:text-primary-400">Coupon Deal</div>
                                        )}
                                    </div>
                                </div>
                                <div className="border-t border-gray-50 dark:border-gray-700 px-4 py-2.5 flex items-center justify-between">
                                    <div className="text-xs text-gray-400">💡 Use {card ? card.cardName.slice(0, 15) : 'your best card'} for max benefits</div>
                                    <button onClick={() => toast.success(`${deal.brand} deal activated! Use at checkout.`)}
                                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                                        Get Deal →
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
