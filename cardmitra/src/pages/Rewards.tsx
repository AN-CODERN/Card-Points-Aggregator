import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatINR, generateId } from '../lib/utils'
import toast from 'react-hot-toast'

const REDEEM_OPTIONS = [
    { id: 'lounge', icon: '✈️', title: 'Airport Lounge Pass', pts: 500, color: 'bg-sky-500' },
    { id: 'flight', icon: '🛫', title: 'Flight Discount', pts: 2000, color: 'bg-blue-600' },
    { id: 'hotel', icon: '🏨', title: 'Hotel Booking', pts: 1500, color: 'bg-amber-500' },
    { id: 'movie', icon: '🎬', title: 'Movie Tickets', pts: 300, color: 'bg-rose-500' },
    { id: 'gift', icon: '🎁', title: 'Gift Cards', pts: 1000, color: 'bg-emerald-500' },
    { id: 'voucher', icon: '🏷️', title: 'Shopping Voucher', pts: 750, color: 'bg-pink-500' },
    { id: 'cashback', icon: '💰', title: 'Convert to Cashback', pts: 250, color: 'bg-violet-500' },
    { id: 'partner', icon: '🤝', title: 'Partner Offers', pts: 400, color: 'bg-orange-500' },
]

export default function Rewards() {
    const nav = useNavigate()
    const { totalPoints, pointsValue, addRedemption, redemptions } = useStore()

    const pts = totalPoints()
    const worth = pointsValue()

    const handleRedeem = (opt: typeof REDEEM_OPTIONS[0]) => {
        if (pts < opt.pts) {
            toast.error(`Need ${opt.pts} pts. You have ${pts} pts.`)
            return
        }
        addRedemption({ id: generateId(), option: opt.title, pointsUsed: opt.pts, date: new Date().toISOString() })
        toast.success(`🎉 ${opt.title} redeemed successfully!`)
    }

    // Best redemption recommendation
    const affordable = REDEEM_OPTIONS.filter(o => o.pts <= pts)
    const best = affordable.length > 0 ? affordable.reduce((a, b) => b.pts > a.pts ? b : a) : null

    return (
        <div className="pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="bg-gradient-to-r from-violet-700 to-primary-600 p-5 pt-10 rounded-b-3xl flex items-center gap-3">
                <button onClick={() => nav('/dashboard')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">←</button>
                <h1 className="text-white font-bold text-lg">⭐ Rewards Center</h1>
            </div>

            <div className="p-4 space-y-5">
                {/* Points balance */}
                <div className="bg-gradient-to-br from-violet-700 to-primary-700 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white/70 text-xs font-medium">Available Points</div>
                            <div className="font-extrabold text-4xl mt-1">{pts.toLocaleString()}</div>
                            <div className="text-white/80 text-sm mt-1">💎 Worth {formatINR(worth)}</div>
                        </div>
                        <div className="text-6xl opacity-50">⭐</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-xl p-2 text-center">
                            <div className="font-bold text-sm">{redemptions.length}</div>
                            <div className="text-[10px] opacity-70">Total Redemptions</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-2 text-center">
                            <div className="font-bold text-sm">{formatINR(redemptions.reduce((a, r) => a + r.pointsUsed * 0.25, 0))}</div>
                            <div className="text-[10px] opacity-70">Total Redeemed</div>
                        </div>
                    </div>
                </div>

                {/* AI Best pick */}
                {best && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex items-center gap-3">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">AI Recommendation</div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">Best redeem: <span className="text-amber-600">{best.title}</span></div>
                            <div className="text-xs text-gray-500">Uses {best.pts} pts – highest value for your balance</div>
                        </div>
                    </div>
                )}

                {/* Redeem grid */}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-3">Redeem Options</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {REDEEM_OPTIONS.map(opt => {
                            const canAfford = pts >= opt.pts
                            return (
                                <button key={opt.id} onClick={() => handleRedeem(opt)}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl p-4 text-left border transition-all hover:shadow-md ${canAfford ? 'border-gray-100 dark:border-gray-700' : 'border-gray-100 dark:border-gray-700 opacity-50'}`}>
                                    <div className={`${opt.color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl mb-3`}>
                                        {opt.icon}
                                    </div>
                                    <div className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{opt.title}</div>
                                    <div className="text-xs text-primary-600 dark:text-primary-400 font-bold mt-1">{opt.pts.toLocaleString()} pts</div>
                                    {!canAfford && <div className="text-[10px] text-red-400 mt-1">Need {opt.pts - pts} more pts</div>}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Redemption history */}
                {redemptions.length > 0 && (
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white mb-3">Redemption History</h2>
                        <div className="space-y-2">
                            {redemptions.map(r => (
                                <div key={r.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
                                    <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 flex-shrink-0">⭐</div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{r.option}</div>
                                        <div className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-rose-500">-{r.pointsUsed} pts</div>
                                        <div className="text-[10px] text-gray-400">= {formatINR(r.pointsUsed * 0.25)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
