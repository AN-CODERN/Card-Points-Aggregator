import React from 'react'

interface Props {
    icon: string
    value: string | number
    label: string
    accent: string   // Tailwind color class e.g. 'bg-primary-500'
    onClick?: () => void
}

export default function StatCard({ icon, value, label, accent, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        >
            <div className={`${accent} w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0`}>
                {icon}
            </div>
            <div className="min-w-0">
                <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            </div>
        </div>
    )
}
