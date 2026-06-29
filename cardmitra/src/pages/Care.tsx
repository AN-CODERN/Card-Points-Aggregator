import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { BANK_HELPLINES } from '../lib/utils'
import toast from 'react-hot-toast'

export default function Care() {
    const nav = useNavigate()
    const cards = useStore(s => s.cards)
    const blockCard = useStore(s => s.blockCard)

    const handleBlock = () => {
        if (!cards.length) return toast.error('No cards to block')
        const id = cards[0].id
        blockCard(id)
        toast.success(`${cards[0].cardName} has been blocked immediately!`)
    }

    const ACTIONS = [
        { icon: '🔒', title: 'Block Card', sub: 'Instantly block any of your cards', color: 'bg-red-500', fn: handleBlock },
        { icon: '⚠️', title: 'Dispute Transaction', sub: 'Raise a dispute for any transaction', color: 'bg-amber-500', fn: () => toast('Dispute form coming soon!') },
        { icon: '🔍', title: 'Track Complaint', sub: 'View open complaints & status', color: 'bg-sky-500', fn: () => toast('Complaint portal coming soon!') },
    ]

    const CONTACTS = [
        { icon: '📞', title: 'Call Support', sub: 'Talk to a card expert', href: 'tel:18001234567', btn: 'Call Now' },
        { icon: '💬', title: 'WhatsApp', sub: 'Chat on WhatsApp', href: 'https://wa.me/918001234567', btn: 'Chat' },
        { icon: '📧', title: 'Email Support', sub: 'support@cardmitra.in', href: 'mailto:support@cardmitra.in', btn: 'Email' },
    ]

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                <h1 className="text-white font-bold text-lg">🛎️ Customer Care</h1>
            </div>

            <div className="p-4 space-y-5">
                {/* Quick actions */}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
                    <div className="space-y-3">
                        {ACTIONS.map(a => (
                            <button key={a.title} onClick={a.fn} className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-left">
                                <div className={`${a.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0`}>{a.icon}</div>
                                <div>
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{a.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{a.sub}</div>
                                </div>
                                <div className="ml-auto text-gray-400">›</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contact options */}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">Contact Us</h2>
                    <div className="space-y-3">
                        {CONTACTS.map(c => (
                            <a key={c.title} href={c.href} target="_blank" rel="noreferrer"
                                className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl flex-shrink-0">{c.icon}</div>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{c.title}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{c.sub}</div>
                                </div>
                                <span className="text-primary-600 dark:text-primary-400 text-xs font-semibold border border-primary-200 dark:border-primary-700 px-3 py-1.5 rounded-xl">{c.btn}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bank helplines */}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">🏦 Bank Helplines</h2>
                    <div className="space-y-2">
                        {Object.entries(BANK_HELPLINES).map(([bank, num]) => (
                            <a key={bank} href={`tel:${num}`}
                                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow">
                                <div>
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{bank}</div>
                                    <div className="text-xs text-gray-500">{num}</div>
                                </div>
                                <span className="text-green-600 dark:text-green-400 text-lg">📞</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
