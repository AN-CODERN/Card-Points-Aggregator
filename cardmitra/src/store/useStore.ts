import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Types ──────────────────────────────────────────────────────────────
export type CardNetwork = 'visa' | 'mastercard' | 'rupay' | 'amex' | 'diners'
export type CardType = 'credit' | 'debit'

export interface Card {
    id: string
    type: CardType
    cardNumber: string       // last 4 digits only stored
    holderName: string
    bank: string
    cardName: string
    network: CardNetwork
    expiry: string
    rewardRate: number       // % per ₹100
    loungeTotal: number
    loungeUsed: number
    cashbackRate: number     // %
    annualFee: number        // ₹ annual fee
    gradientIndex: number    // 0-4 for card-gradient-N
    isBlocked: boolean
    addedAt: string
}

export interface Transaction {
    id: string
    merchant: string
    amount: number
    date: string
    cardId: string
    category: string
    pointsEarned: number
    cashbackEarned: number
    rewardRate: number
    savings: number
}

export interface User {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    joinedAt: string
}

export interface Redemption {
    id: string
    option: string
    pointsUsed: number
    date: string
}

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning'
    read: boolean
    date: string
}

// ── Store interface ─────────────────────────────────────────────────────
interface CardMitraState {
    user: User | null
    isAuthenticated: boolean
    darkMode: boolean
    cards: Card[]
    transactions: Transaction[]
    redemptions: Redemption[]
    notifications: Notification[]
    aiHistory: { role: 'user' | 'ai'; message: string }[]

    // Auth
    login: (user: User) => void
    logout: () => void
    updateUser: (u: Partial<User>) => void

    // Cards
    addCard: (card: Card) => void
    removeCard: (id: string) => void
    blockCard: (id: string) => void
    updateCard: (id: string, updates: Partial<Card>) => void

    // Transactions
    addTransaction: (txn: Transaction) => void

    // Redemptions
    addRedemption: (r: Redemption) => void

    // Notifications
    addNotification: (n: Notification) => void
    markAllRead: () => void

    // AI
    addAIMessage: (role: 'user' | 'ai', message: string) => void
    clearAIHistory: () => void

    // UI
    toggleDarkMode: () => void

    // Computed helpers
    totalPoints: () => number
    totalCashback: () => number
    totalSavings: () => number
    pointsValue: () => number
    totalLounge: () => number
}

// ── Store ───────────────────────────────────────────────────────────────
export const useStore = create<CardMitraState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            darkMode: false,
            cards: [],
            transactions: [],
            redemptions: [],
            notifications: [],
            aiHistory: [],

            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false, cards: [], transactions: [], redemptions: [], aiHistory: [] }),
            updateUser: (u) => set(s => ({ user: s.user ? { ...s.user, ...u } : null })),

            addCard: (card) => set(s => ({ cards: [...s.cards, card] })),
            removeCard: (id) => set(s => ({ cards: s.cards.filter(c => c.id !== id) })),
            blockCard: (id) => set(s => ({ cards: s.cards.map(c => c.id === id ? { ...c, isBlocked: true } : c) })),
            updateCard: (id, updates) => set(s => ({ cards: s.cards.map(c => c.id === id ? { ...c, ...updates } : c) })),

            addTransaction: (txn) => set(s => ({ transactions: [txn, ...s.transactions] })),

            addRedemption: (r) => set(s => ({ redemptions: [r, ...s.redemptions] })),

            addNotification: (n) => set(s => ({ notifications: [n, ...s.notifications] })),
            markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),

            addAIMessage: (role, message) => set(s => ({ aiHistory: [...s.aiHistory, { role, message }] })),
            clearAIHistory: () => set({ aiHistory: [] }),

            toggleDarkMode: () => set(s => {
                const next = !s.darkMode
                document.documentElement.classList.toggle('dark', next)
                return { darkMode: next }
            }),

            totalPoints: () => {
                const { transactions, redemptions } = get()
                const earned = transactions.reduce((a, t) => a + t.pointsEarned, 0)
                const spent = redemptions.reduce((a, r) => a + r.pointsUsed, 0)
                return Math.max(0, earned - spent)
            },
            totalCashback: () => get().transactions.reduce((a, t) => a + t.cashbackEarned, 0),
            totalSavings: () => get().transactions.reduce((a, t) => a + t.savings, 0),
            pointsValue: () => Math.round(get().totalPoints() * 0.25),   // 1 pt = ₹0.25
            totalLounge: () => get().cards.reduce((a, c) => a + (c.loungeTotal - c.loungeUsed), 0),
        }),
        {
            name: 'cardmitra-db',    // persisted to localStorage as JSON
            partialize: (s) => ({
                user: s.user,
                isAuthenticated: s.isAuthenticated,
                darkMode: s.darkMode,
                cards: s.cards,
                transactions: s.transactions,
                redemptions: s.redemptions,
                notifications: s.notifications,
                aiHistory: s.aiHistory,
            }),
        }
    )
)
