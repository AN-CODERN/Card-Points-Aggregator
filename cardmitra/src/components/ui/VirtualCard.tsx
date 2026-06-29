import React from 'react'
import type { Card } from '../../store/useStore'
import { maskCard, CARD_GRADIENTS } from '../../lib/utils'

const NETWORK_LOGO: Record<string, React.ReactNode> = {
    visa: <span className="font-extrabold italic text-white text-xl tracking-tight">VISA</span>,
    mastercard: <span className="flex gap-[-8px]"><span className="w-7 h-7 rounded-full bg-red-500 opacity-90 inline-block" /><span className="w-7 h-7 rounded-full bg-yellow-400 opacity-90 inline-block -ml-3" /></span>,
    rupay: <span className="font-bold text-white text-sm bg-white/20 px-2 py-0.5 rounded">RuPay</span>,
    amex: <span className="font-bold text-white text-sm tracking-widest">AMEX</span>,
    diners: <span className="font-bold text-white text-xs">DINERS</span>,
}

interface Props {
    card: Card
    mini?: boolean
    onClick?: () => void
}

export default function VirtualCard({ card, mini = false, onClick }: Props) {
    const gradient = CARD_GRADIENTS[card.gradientIndex % CARD_GRADIENTS.length]

    return (
        <div
            onClick={onClick}
            className={`
        ${gradient} relative rounded-2xl overflow-hidden text-white shadow-2xl
        ${mini ? 'w-44 h-28 p-3 flex-shrink-0' : 'w-full aspect-[1.6/1] p-5'}
        ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
        ${card.isBlocked ? 'opacity-50 grayscale' : ''}
      `}
            style={{ fontFamily: "'Courier New', monospace" }}
        >
            {/* Shine overlay */}
            <div className="absolute inset-0 card-shine" />

            {/* Blocked banner */}
            {card.isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                    <span className="text-red-400 font-bold text-lg tracking-widest">BLOCKED</span>
                </div>
            )}

            {/* Bank name */}
            <div className={`${mini ? 'text-[9px]' : 'text-xs'} font-semibold opacity-80 tracking-wider uppercase`}>
                {card.bank}
            </div>

            {/* Chip */}
            {!mini && (
                <div className="mt-3 mb-4 w-10 h-7 rounded-md bg-yellow-400/80 flex items-center justify-center">
                    <div className="w-6 h-4 rounded-sm border border-yellow-600/50 grid grid-cols-3 gap-px p-0.5">
                        {[...Array(6)].map((_, i) => <div key={i} className="bg-yellow-600/40 rounded-sm" />)}
                    </div>
                </div>
            )}

            {/* Card number */}
            <div className={`${mini ? 'text-[10px] mt-1' : 'text-sm'} tracking-[0.2em] font-mono`}>
                {maskCard(card.cardNumber)}
            </div>

            {/* Bottom info */}
            <div className={`flex justify-between items-end ${mini ? 'mt-1' : 'mt-4'}`}>
                <div>
                    {!mini && <div className="text-[9px] opacity-60 tracking-widest uppercase">Card Holder</div>}
                    <div className={`${mini ? 'text-[9px]' : 'text-sm'} font-semibold uppercase tracking-wider truncate max-w-[140px]`}>
                        {card.holderName}
                    </div>
                    {!mini && (
                        <div className="mt-1">
                            <div className="text-[9px] opacity-60 tracking-widest uppercase">Valid Thru</div>
                            <div className="text-xs font-mono">{card.expiry}</div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    {NETWORK_LOGO[card.network]}
                    {mini && <div className="text-[8px] opacity-60">{card.cardName.slice(0, 12)}</div>}
                    {!mini && (
                        <div className="text-[10px] opacity-70 bg-white/10 px-2 py-0.5 rounded capitalize">
                            {card.type}
                        </div>
                    )}
                </div>
            </div>

            {/* Card name small label */}
            {!mini && (
                <div className="absolute top-4 right-4 text-[10px] opacity-60 text-right leading-tight">
                    {card.cardName}
                </div>
            )}
        </div>
    )
}
