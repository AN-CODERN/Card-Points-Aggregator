import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { Transaction } from '../store/useStore'
import { generateId, formatINR } from '../lib/utils'
import toast from 'react-hot-toast'

const CATEGORIES = [
    { name: 'Shopping', icon: '🛒' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Food', icon: '🍽️' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Fuel', icon: '⛽' },
    { name: 'Utilities', icon: '⚡' },
    { name: 'Groceries', icon: '🛍️' },
    { name: 'Other', icon: '📦' },
]

export default function AddTransaction() {
    const nav = useNavigate()
    const { cards, addTransaction } = useStore()

    const [merchant, setMerchant] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [cardId, setCardId] = useState(cards[0]?.id ?? '')
    const [category, setCategory] = useState('Shopping')

    const selectedCard = cards.find(c => c.id === cardId)
    const amt = parseFloat(amount) || 0
    const rate = selectedCard?.rewardRate ?? 1
    const pts = Math.floor(amt * rate / 100)
    const cashback = parseFloat((amt * (selectedCard?.cashbackRate ?? 0) / 100).toFixed(2))
    const savings = parseFloat((cashback + pts * 0.25).toFixed(2))

    useEffect(() => {
        if (cards.length && !cardId) setCardId(cards[0].id)
    }, [cards])

    const handleSave = () => {
        if (!merchant.trim()) return toast.error('Enter merchant name')
        if (!amt || amt <= 0) return toast.error('Enter a valid amount')
        if (!cardId) return toast.error('Select a card')
        const txn: Transaction = {
            id: generateId(), merchant: merchant.trim(), amount: amt,
            date, cardId, category, pointsEarned: pts,
            cashbackEarned: cashback, rewardRate: rate, savings,
        }
        addTransaction(txn)
        toast.success(`💸 Transaction saved! +${pts} pts earned`)
        nav('/dashboard')
    }

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-primary-700 to-brand-red p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                <h1 className="text-white font-bold text-lg">Add Transaction</h1>
            </div>

            <div className="p-4 space-y-5">
                {/* Rewards preview */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white">
                    <div className="text-xs font-semibold opacity-80 mb-3">✨ Estimated Rewards for this Transaction</div>
                    <div className="grid grid-cols-4 gap-3 text-center">
                        <div><div className="font-extrabold text-lg">{pts}</div><div className="text-[10px] opacity-80">Points</div></div>
                        <div><div className="font-extrabold text-lg">{formatINR(cashback)}</div><div className="text-[10px] opacity-80">Cashback</div></div>
                        <div><div className="font-extrabold text-lg">{formatINR(pts * 0.25)}</div><div className="text-[10px] opacity-80">Pts Value</div></div>
                        <div><div className="font-extrabold text-lg">{rate}%</div><div className="text-[10px] opacity-80">Rate</div></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-4 border border-gray-100 dark:border-gray-700">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Merchant Name *</label>
                        <input value={merchant} onChange={e => setMerchant(e.target.value)}
                            className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g. Amazon, Zomato, BPCL" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (₹) *</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min={0}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="0.00" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Used *</label>
                        {cards.length === 0 ? (
                            <div className="mt-1 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-sm text-amber-700 dark:text-amber-400">
                                ⚠️ No cards added yet. <button onClick={() => nav('/add-card')} className="underline font-semibold">Add a card first</button>
                            </div>
                        ) : (
                            <select value={cardId} onChange={e => setCardId(e.target.value)}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                {cards.map(c => <option key={c.id} value={c.id}>{c.cardName} – {c.bank} (•••{c.cardNumber})</option>)}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            {CATEGORIES.map(cat => (
                                <button key={cat.name} onClick={() => setCategory(cat.name)}
                                    className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs font-medium transition-all ${category === cat.name ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                                    <span className="text-lg">{cat.icon}</span>{cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
                    ✅ Save Transaction
                </button>
            </div>
        </div>
    )
}
