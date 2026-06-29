import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { generateAIResponse } from '../lib/aiEngine'

const QUICK_QUERIES = [
    { label: '📊 My Points', q: 'How many reward points do I have?' },
    { label: '🛒 Best for Amazon', q: 'Which card is best for Amazon shopping?' },
    { label: '⛽ Best for Fuel', q: 'Which card gives maximum cashback for fuel?' },
    { label: '✈️ Lounge Visits', q: 'How many lounge visits are left?' },
    { label: '💰 Monthly Cashback', q: 'How much cashback did I earn this month?' },
    { label: '🌍 Best Travel Card', q: 'Which is my best card for travel?' },
    { label: '⏰ Expiring Rewards', q: 'Which rewards are about to expire?' },
    { label: '💎 Points Value', q: 'What is the value of my total points?' },
    { label: '💡 Maximize Tips', q: 'How can I maximize my card rewards?' },
    { label: '📋 Spending Summary', q: 'Give me a spending summary' },
]

function renderMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>')
        .replace(/• /g, '&bull; ')
}

export default function AI() {
    const nav = useNavigate()
    const {
        user, cards, transactions, aiHistory,
        totalPoints, totalCashback, totalSavings, totalLounge, pointsValue,
        addAIMessage, clearAIHistory,
    } = useStore()

    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const chatRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
    }, [aiHistory])

    const sendMessage = async (q: string) => {
        const msg = q || input.trim()
        if (!msg) return
        setInput('')
        addAIMessage('user', msg)
        setLoading(true)

        // Simulate AI thinking delay
        await new Promise(r => setTimeout(r, 600 + Math.random() * 600))

        const ctx = {
            cards, transactions,
            totalPoints: totalPoints(),
            totalCashback: totalCashback(),
            totalSavings: totalSavings(),
            totalLounge: totalLounge(),
            pointsValue: pointsValue(),
            userName: user?.name ?? '',
        }
        const reply = generateAIResponse(msg, ctx)
        addAIMessage('ai', reply)
        setLoading(false)
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-700 to-primary-700 p-5 pt-10 rounded-b-3xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🤖</div>
                        <div>
                            <div className="text-white font-bold">CardMitra AI</div>
                            <div className="text-white/70 text-xs">Your Personal Rewards Expert</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-xs">Online</span>
                    </div>
                </div>
            </div>

            {/* Quick queries */}
            {aiHistory.length === 0 && (
                <div className="p-4 flex-shrink-0">
                    <div className="text-center mb-4">
                        <div className="text-5xl mb-2">🤖</div>
                        <div className="font-bold text-gray-900 dark:text-white">Hi {user?.name?.split(' ')[0] ?? 'there'}!</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">I'm your personal rewards expert. Ask me anything!</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_QUERIES.map(q => (
                            <button key={q.q} onClick={() => sendMessage(q.q)}
                                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 transition-colors">
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Chat */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                        {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-primary-600 flex items-center justify-center text-white text-sm flex-shrink-0">🤖</div>
                        )}
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-primary-600 text-white rounded-br-sm'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-sm'
                            }`}>
                            {msg.role === 'ai'
                                ? <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.message) }} />
                                : msg.message
                            }
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 text-sm flex-shrink-0">
                                {user?.name?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-primary-600 flex items-center justify-center text-white text-sm">🤖</div>
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                <div className="flex gap-2 items-center">
                    {aiHistory.length > 0 && (
                        <button onClick={clearAIHistory} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm" title="Clear chat">
                            🗑️
                        </button>
                    )}
                    <input
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage('')}
                        className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Ask me anything about your cards..." />
                    <button onClick={() => sendMessage('')} disabled={!input.trim() || loading}
                        className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-primary-600 flex items-center justify-center text-white disabled:opacity-50 hover:opacity-90 transition-opacity">
                        📤
                    </button>
                </div>
            </div>
        </div>
    )
}
