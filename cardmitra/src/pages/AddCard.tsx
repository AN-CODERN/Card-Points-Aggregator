import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { Card, CardNetwork, CardType } from '../store/useStore'
import VirtualCard from '../components/ui/VirtualCard'
import { generateId } from '../lib/utils'
import toast from 'react-hot-toast'

const BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'IndusInd Bank', 'American Express', 'Citibank', 'Standard Chartered']

export default function AddCard() {
    const nav = useNavigate()
    const addCard = useStore(s => s.addCard)
    const cards = useStore(s => s.cards)

    const [type, setType] = useState<CardType>('credit')
    const [number, setNumber] = useState('')
    const [holder, setHolder] = useState('')
    const [expiry, setExpiry] = useState('')
    const [bank, setBank] = useState('')
    const [network, setNetwork] = useState<CardNetwork>('visa')
    const [cardName, setCardName] = useState('')
    const [rewardRate, setRewardRate] = useState(1)
    const [loungeTotal, setLoungeTotal] = useState(0)
    const [gradientIdx, setGradientIdx] = useState(0)
    const [annualFee, setAnnualFee] = useState(0)

    // Format helpers
    const fmtNumber = (v: string) => {
        const d = v.replace(/\D/g, '').slice(0, 16)
        return d.replace(/(.{4})/g, '$1 ').trim()
    }
    const fmtExpiry = (v: string) => {
        const d = v.replace(/\D/g, '').slice(0, 4)
        return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
    }

    const previewCard: Card = {
        id: 'preview', type, cardNumber: number.replace(/\s/g, '').slice(-4) || '1234',
        holderName: holder || 'YOUR NAME', bank: bank || 'Your Bank',
        cardName: cardName || 'Card Name', network, expiry: expiry || 'MM/YY',
        rewardRate, loungeTotal, loungeUsed: 0, cashbackRate: rewardRate * 0.5,
        annualFee, gradientIndex: gradientIdx, isBlocked: false, addedAt: new Date().toISOString(),
    }

    const handleAdd = () => {
        if (!number || !holder || !bank || !cardName) return toast.error('Please fill all required fields')
        const raw = number.replace(/\s/g, '')
        if (raw.length < 15) return toast.error('Enter a valid card number')
        const card: Card = { ...previewCard, id: generateId(), cardNumber: raw.slice(-4), annualFee, addedAt: new Date().toISOString() }
        addCard(card)
        toast.success(`${cardName} added successfully! 💳`)
        nav('/dashboard')
    }

    const gradients = [
        'from-slate-900 via-blue-950 to-blue-900',
        'from-purple-900 via-violet-800 to-emerald-700',
        'from-rose-800 via-rose-700 to-purple-900',
        'from-teal-900 via-teal-700 to-green-600',
        'from-gray-800 via-gray-700 to-blue-600',
    ]

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-brand-red p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
                    ←
                </button>
                <h1 className="text-white font-bold text-lg">Add New Card</h1>
            </div>

            <div className="p-4 space-y-5">
                {/* Card type */}
                <div className="grid grid-cols-2 gap-3">
                    {(['credit', 'debit'] as CardType[]).map(t => (
                        <button key={t} onClick={() => setType(t)}
                            className={`py-4 rounded-2xl border-2 font-semibold text-sm capitalize transition-all ${type === t ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'}`}>
                            {t === 'credit' ? '💳 Credit Card' : '🏦 Debit Card'}
                            <div className="text-xs font-normal opacity-70 mt-1">{t === 'credit' ? 'Earn points & cashback' : 'Track debit rewards'}</div>
                        </button>
                    ))}
                </div>

                {/* Virtual card preview */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Card Preview</h3>
                    <VirtualCard card={previewCard} />
                </div>

                {/* Colour picker */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Card Colour</h3>
                    <div className="flex gap-3">
                        {gradients.map((g, i) => (
                            <button key={i} onClick={() => setGradientIdx(i)}
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g} ${gradientIdx === i ? 'ring-2 ring-primary-600 ring-offset-2' : ''} transition-all`}
                            />
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-4 border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white">🪪 Card Details</h3>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Card Number *</label>
                        <input value={number} onChange={e => setNumber(fmtNumber(e.target.value))} maxLength={19}
                            className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="XXXX XXXX XXXX XXXX" />
                        <p className="text-[10px] text-gray-400 mt-1">Only the last 4 digits will be displayed on your virtual card</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Holder Name *</label>
                            <input value={holder} onChange={e => setHolder(e.target.value.toUpperCase())}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="AS ON CARD" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expiry *</label>
                            <input value={expiry} onChange={e => setExpiry(fmtExpiry(e.target.value))} maxLength={5}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="MM/YY" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bank *</label>
                            <select value={bank} onChange={e => setBank(e.target.value)}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <option value="">Select Bank</option>
                                {BANKS.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Network</label>
                            <select value={network} onChange={e => setNetwork(e.target.value as CardNetwork)}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                {['visa', 'mastercard', 'rupay', 'amex', 'diners'].map(n => <option key={n} value={n} className="capitalize">{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Card Name / Variant *</label>
                        <input value={cardName} onChange={e => setCardName(e.target.value)}
                            className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g. HDFC Regalia, SBI SimplyCLICK" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reward Rate (%)</label>
                            <input type="number" value={rewardRate} onChange={e => setRewardRate(+e.target.value)} min={0} max={20} step={0.1}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lounge Visits/yr</label>
                            <input type="number" value={loungeTotal} onChange={e => setLoungeTotal(+e.target.value)} min={0} max={50}
                                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>
                </div>

                <button onClick={handleAdd} className="w-full py-4 bg-gradient-to-r from-primary-600 to-brand-red text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
                    🔒 Add Card Securely
                </button>
            </div>
        </div>
    )
}
