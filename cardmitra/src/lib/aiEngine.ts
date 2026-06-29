import type { Card, Transaction } from '../store/useStore'

// ══════════════════════════════════════════════════════════════════════
//  CardMitra AI — Rule-based NLU engine
//  Answers every question from the Product Vision document.
//  No API key needed — runs entirely on the user's real data.
// ══════════════════════════════════════════════════════════════════════

export interface AIContext {
    cards: Card[]
    transactions: Transaction[]
    totalPoints: number
    totalCashback: number
    totalSavings: number
    totalLounge: number
    pointsValue: number
    userName: string
}

// ── Merchant → Category mapping ────────────────────────────────────────
const MERCHANT_CAT: Record<string, string> = {
    amazon: 'Shopping', flipkart: 'Shopping', myntra: 'Shopping',
    meesho: 'Shopping', nykaa: 'Shopping', ajio: 'Shopping',
    zomato: 'Food', swiggy: 'Food', blinkit: 'Food',
    dunzo: 'Food', bigbasket: 'Groceries', jiomart: 'Groceries',
    dmart: 'Groceries',
    bpcl: 'Fuel', hpcl: 'Fuel', iocl: 'Fuel',
    indianoil: 'Fuel', reliance: 'Fuel',
    makemytrip: 'Travel', cleartrip: 'Travel', goibibo: 'Travel',
    indigo: 'Travel', airindia: 'Travel', vistara: 'Travel',
    irctc: 'Travel', ola: 'Travel', uber: 'Travel',
    pvr: 'Entertainment', inox: 'Entertainment', bookmyshow: 'Entertainment',
    netflix: 'Entertainment', hotstar: 'Entertainment', spotify: 'Entertainment',
    airtel: 'Utilities', jio: 'Utilities', vodafone: 'Utilities',
    bsnl: 'Utilities', bescom: 'Utilities', tata: 'Utilities',
}

// ── Category → keywords mapping ────────────────────────────────────────
const CAT_KEYWORDS: Record<string, string[]> = {
    Fuel: ['fuel', 'petrol', 'diesel', 'pump', 'gas station', 'bpcl', 'hpcl', 'iocl'],
    Travel: ['travel', 'flight', 'hotel', 'train', 'irctc', 'cab', 'ola', 'uber', 'trip', 'booking'],
    Food: ['food', 'dining', 'restaurant', 'zomato', 'swiggy', 'eat', 'meal'],
    Shopping: ['shopping', 'amazon', 'flipkart', 'myntra', 'online', 'purchase'],
    Groceries: ['grocery', 'groceries', 'bigbasket', 'dmart', 'vegetables', 'fruits'],
    Entertainment: ['movie', 'cinema', 'pvr', 'inox', 'netflix', 'entertainment', 'hotstar'],
    Utilities: ['utility', 'bill', 'electricity', 'phone', 'recharge', 'wifi', 'broadband'],
}

// ── Helpers ────────────────────────────────────────────────────────────
function detectCategory(q: string): string {
    for (const [cat, kws] of Object.entries(CAT_KEYWORDS)) {
        if (kws.some(k => q.includes(k))) return cat
    }
    return 'Shopping'
}

function detectMerchant(q: string): string | null {
    return Object.keys(MERCHANT_CAT).find(m => q.includes(m)) ?? null
}

function bestCardForCategory(cards: Card[], _cat: string): Card | null {
    if (!cards.length) return null
    const active = cards.filter(c => !c.isBlocked)
    if (!active.length) return null
    return active.reduce((b, c) => c.rewardRate > b.rewardRate ? c : b)
}

function monthly(transactions: Transaction[]) {
    const now = new Date()
    const m = now.getMonth(), y = now.getFullYear()
    const txns = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === m && d.getFullYear() === y })
    return {
        txns,
        points: txns.reduce((a, t) => a + t.pointsEarned, 0),
        cashback: txns.reduce((a, t) => a + t.cashbackEarned, 0),
        savings: txns.reduce((a, t) => a + t.savings, 0),
        spent: txns.reduce((a, t) => a + t.amount, 0),
    }
}

function yearly(transactions: Transaction[]) {
    const y = new Date().getFullYear()
    const txns = transactions.filter(t => new Date(t.date).getFullYear() === y)
    return {
        points: txns.reduce((a, t) => a + t.pointsEarned, 0),
        cashback: txns.reduce((a, t) => a + t.cashbackEarned, 0),
        savings: txns.reduce((a, t) => a + t.savings, 0),
        spent: txns.reduce((a, t) => a + t.amount, 0),
    }
}

function fmtINR(n: number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n)
}

// ══════════════════════════════════════════════════════════════════════
//  MAIN RESPONSE GENERATOR
// ══════════════════════════════════════════════════════════════════════
export function generateAIResponse(input: string, ctx: AIContext): string {
    const q = input.toLowerCase().trim()
    const { cards, transactions, totalPoints, totalCashback, totalSavings, totalLounge, pointsValue, userName } = ctx
    const name = userName?.split(' ')[0] || 'there'
    const active = cards.filter(c => !c.isBlocked)

    // ── GREETINGS ────────────────────────────────────────────────────────
    if (/^(hi|hello|hey|namaste|hii|helo)/.test(q)) {
        return `Hi ${name}! 👋 I'm **CardMitra AI**, your personal card rewards expert.\n\nHere's what I can help you with:\n• 💳 Which card to use for any purchase\n• ⭐ Checking points & cashback earned\n• ✈️ Lounge access tracking\n• 📊 Monthly & yearly savings reports\n• 💰 Reward expiry alerts\n• 🏆 Card profitability analysis\n\nJust ask anything — I'm here!`
    }

    // ── POINTS BALANCE ───────────────────────────────────────────────────
    if ((q.includes('how many') || q.includes('total') || q.includes('check')) && q.includes('point')) {
        return `⭐ Hey ${name}! You currently have **${totalPoints.toLocaleString()} reward points** worth **${fmtINR(pointsValue)}** (₹0.25/pt).\n\n${totalPoints >= 2000 ? '🛫 You can redeem a **Flight Discount** right now (2000 pts)!' : totalPoints >= 500 ? '✈️ You can get a **free Lounge Pass** right now (500 pts)!' : `Earn ${500 - totalPoints} more points to unlock your first Lounge Pass!`}`
    }

    // ── POINTS VALUE ─────────────────────────────────────────────────────
    if ((q.includes('value') || q.includes('worth')) && q.includes('point')) {
        return `💎 Your **${totalPoints.toLocaleString()} points** are worth **${fmtINR(pointsValue)}** at the standard ₹0.25/pt rate.\n\nBest redemption options:\n• ✈️ Lounge Pass – 500 pts = ${fmtINR(125)}\n• 🎬 Movie Tickets – 300 pts = ${fmtINR(75)}\n• 🛫 Flight Discount – 2000 pts = ${fmtINR(500)}\n• 💰 Cashback – 250 pts = ${fmtINR(62.5)}`
    }

    // ── BEST CARD RECOMMENDATION ─────────────────────────────────────────
    if (q.includes('which card') || q.includes('best card') || q.includes('use card') || q.includes('should i use') || q.includes('recommend')) {
        if (!active.length) return `You haven't added any active cards yet. Add your cards so I can recommend the best one! 💳`
        const merchant = detectMerchant(q)
        const cat = merchant ? (MERCHANT_CAT[merchant] || detectCategory(q)) : detectCategory(q)
        const best = bestCardForCategory(active, cat)
        if (!best) return `Couldn't determine the best card. Please add more cards for better recommendations.`
        const runner = active.filter(c => c.id !== best.id).sort((a, b) => b.rewardRate - a.rewardRate)[0]
        return `🏆 **Best card for ${merchant ? merchant.charAt(0).toUpperCase() + merchant.slice(1) : cat}:**\n\n💳 **${best.cardName}** by ${best.bank}\n• Reward Rate: **${best.rewardRate}%** per ₹100\n• Network: ${best.network.toUpperCase()}\n• Lounge Access: ${best.loungeTotal - best.loungeUsed} visits left\n${runner ? `\n🥈 Runner-up: **${runner.cardName}** (${runner.rewardRate}% rate)` : ''}\n\n💡 Use this card to earn maximum rewards on every ${cat} transaction!`
    }

    // ── CASHBACK THIS MONTH ──────────────────────────────────────────────
    if (q.includes('cashback') && (q.includes('month') || q.includes('this month') || q.includes('earn'))) {
        const m = monthly(transactions)
        return `💰 **This Month's Cashback Report:**\n\n• Cashback Earned: **${fmtINR(m.cashback)}**\n• Points Earned: **${m.points.toLocaleString()}** (worth ${fmtINR(m.points * 0.25)})\n• Total Savings: **${fmtINR(m.savings)}**\n• Transactions: **${m.txns.length}**\n• Total Spent: **${fmtINR(m.spent)}**\n\nNet benefit this month: **${fmtINR(m.cashback + m.points * 0.25)}** 🎉`
    }

    // ── TOTAL CASHBACK ───────────────────────────────────────────────────
    if (q.includes('total cashback') || (q.includes('cashback') && (q.includes('total') || q.includes('all')))) {
        return `📊 **Total Cashback Earned:** **${fmtINR(totalCashback)}**\n• Points Worth: ${fmtINR(pointsValue)}\n• Total Savings: ${fmtINR(totalSavings)}\n\nCombined benefit: **${fmtINR(totalCashback + pointsValue)}** across all transactions!`
    }

    // ── LOUNGE ACCESS ────────────────────────────────────────────────────
    if (q.includes('lounge')) {
        if (!cards.length) return `No cards added yet. Add a card to track lounge access! ✈️`
        const loungeCards = cards.filter(c => c.loungeTotal > 0)
        if (!loungeCards.length) return `Your current cards don't include airport lounge access.\n\n💡 **Cards with lounge access:** HDFC Regalia, Axis Magnus, SBI Elite, ICICI Sapphiro — consider upgrading!`
        const details = loungeCards.map(c => `• **${c.cardName}** (${c.bank}): **${c.loungeTotal - c.loungeUsed}** of ${c.loungeTotal} visits left${c.isBlocked ? ' ⛔ Blocked' : ''}`).join('\n')
        return `✈️ **Airport Lounge Access Summary:**\n\n${details}\n\n**Total visits remaining: ${totalLounge}**`
    }

    // ── EXPIRING REWARDS ─────────────────────────────────────────────────
    if (q.includes('expir')) {
        return `⏰ **Reward Expiry Alert for ${name}:**\n\nYou have **${totalPoints.toLocaleString()} points** worth **${fmtINR(pointsValue)}**.\n\nTypically, reward points expire in **2–3 years** from the earn date.\n\n${totalPoints >= 500 ? `✅ **Action needed:** Redeem now!\n• ✈️ Lounge Pass: 500 pts (${fmtINR(125)} value)\n• 🎬 Movie Tickets: 300 pts (${fmtINR(75)} value)` : `💡 Earn ${500 - totalPoints} more points to unlock first redemption.`}\n\nAlways redeem oldest points first to avoid expiry losses!`
    }

    // ── SAVINGS SUMMARY ──────────────────────────────────────────────────
    if (q.includes('saving') || q.includes('saved') || q.includes('how much')) {
        const m = monthly(transactions)
        const y = yearly(transactions)
        return `🐷 **Savings Report for ${name}:**\n\n📅 **This Month:** ${fmtINR(m.savings)} saved\n📆 **This Year:** ${fmtINR(y.savings)} saved\n🏆 **All Time:** ${fmtINR(totalSavings)} saved\n\n💰 Cashback all time: **${fmtINR(totalCashback)}**\n⭐ Points value: **${fmtINR(pointsValue)}**\n\nTotal benefit: **${fmtINR(totalSavings + totalCashback + pointsValue)}** 🎉`
    }

    // ── IS MY CARD WORTH IT (Annual fee ROI) ────────────────────────────
    if (q.includes('worth') && (q.includes('annual') || q.includes('fee') || q.includes('card worth'))) {
        if (!cards.length) return `No cards added yet! Add your cards so I can analyse their profitability.`
        const best = [...cards].sort((a, b) => b.rewardRate - a.rewardRate)[0]
        const cardTxns = transactions.filter(t => t.cardId === best.id)
        const earned = cardTxns.reduce((a, t) => a + t.cashbackEarned + t.pointsEarned * 0.25, 0)
        return `💳 **Card ROI Analysis — ${best.cardName}:**\n\n• Total earned (cashback + pts): **${fmtINR(earned)}**\n• Transactions: **${cardTxns.length}**\n• Reward rate: **${best.rewardRate}%**\n\n${earned > 500 ? `✅ This card is **profitable** — you've earned ${fmtINR(earned)} in benefits!` : `⚠️ You've earned ${fmtINR(earned)} so far. Keep using this card more to maximise value.`}\n\n💡 Tip: Use this card for ALL eligible purchases to maximise ROI.`
    }

    // ── QUARTERLY BENEFITS ───────────────────────────────────────────────
    if (q.includes('quarter') || q.includes('benefit') || q.includes('left')) {
        if (!cards.length) return `Add your cards to track benefits!`
        const benefitSummary = cards.map(c => `• **${c.cardName}**: ${c.loungeTotal - c.loungeUsed} lounge visits, ${c.rewardRate}% rewards`).join('\n')
        return `📋 **Benefits Remaining This Quarter:**\n\n${benefitSummary}\n\n💡 Use your benefits before they reset each quarter!`
    }

    // ── SPENDING SUMMARY ─────────────────────────────────────────────────
    if (q.includes('spending') || q.includes('spent') || q.includes('transaction')) {
        const total = transactions.reduce((a, t) => a + t.amount, 0)
        const cats = transactions.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc }, {} as Record<string, number>)
        const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1])
        const m = monthly(transactions)
        return `📊 **Spending Summary for ${name}:**\n\n• All-time total: **${fmtINR(total)}** across **${transactions.length}** transactions\n• This month: **${fmtINR(m.spent)}** (${m.txns.length} transactions)\n\n**Top categories:**\n${sorted.slice(0, 4).map(([c, a]) => `• ${c}: ${fmtINR(a)}`).join('\n') || '• No data yet'}`
    }

    // ── MY CARDS LIST ────────────────────────────────────────────────────
    if (q.includes('my card') || q.includes('all card') || q.includes('card list') || q.includes('how many card')) {
        if (!cards.length) return `You haven't added any cards yet! Tap **+ Add Card** on the dashboard to get started. 🃏`
        const list = cards.map(c => `• **${c.cardName}** – ${c.bank} (${c.type}) – ${c.rewardRate}% rate${c.isBlocked ? ' ⛔' : '✅'}`).join('\n')
        return `💳 You have **${cards.length} card(s):**\n\n${list}\n\n📍 Active lounge visits remaining: **${totalLounge}**`
    }

    // ── MONTHLY SUMMARY ──────────────────────────────────────────────────
    if (q.includes('month') || q.includes('this month')) {
        const m = monthly(transactions)
        return `📅 **Monthly Summary:**\n\n• Transactions: **${m.txns.length}**\n• Total Spent: **${fmtINR(m.spent)}**\n• Points Earned: **${m.points.toLocaleString()}** (${fmtINR(m.points * 0.25)})\n• Cashback: **${fmtINR(m.cashback)}**\n• Savings: **${fmtINR(m.savings)}**\n\nTotal accumulated points: **${totalPoints.toLocaleString()}** worth **${fmtINR(pointsValue)}**`
    }

    // ── TIPS / MAXIMIZE ──────────────────────────────────────────────────
    if (q.includes('tip') || q.includes('advice') || q.includes('maximize') || q.includes('maximise') || q.includes('improve') || q.includes('better')) {
        const best = active.length ? [...active].sort((a, b) => b.rewardRate - a.rewardRate)[0] : null
        return `💡 **Top CardMitra AI Tips for ${name}:**\n\n1. 💳 Use **${best ? best.cardName : 'your highest reward card'}** for everyday spend (${best ? best.rewardRate + '% rate' : 'max rate'})\n2. ⛽ Always pay fuel with a card offering **fuel surcharge waiver**\n3. ✈️ Use travel cards for flights & hotels to earn **5–10x points**\n4. 🛒 Stack card cashback with **merchant discount codes**\n5. ⏰ Redeem points **before expiry** — check every quarter\n6. 📊 Review your monthly savings report to spot underused cards\n7. 🔄 Never use a blocked card — activate it first in Settings${totalPoints > 500 ? `\n\n⭐ You have ${totalPoints} points! Redeem now for ${totalPoints >= 2000 ? '✈️ a Flight Discount' : totalPoints >= 500 ? '🛋️ a Lounge Pass' : '🎬 Movie Tickets'}.` : ''}`
    }

    // ── MOST USED CARD ───────────────────────────────────────────────────
    if (q.includes('most used') || q.includes('frequently used') || q.includes('popular')) {
        if (!transactions.length) return `No transactions yet. Add some to see your most used card!`
        const usage = transactions.reduce((acc, t) => { acc[t.cardId] = (acc[t.cardId] || 0) + 1; return acc }, {} as Record<string, number>)
        const topId = Object.entries(usage).sort((a, b) => b[1] - a[1])[0]?.[0]
        const topCard = cards.find(c => c.id === topId)
        return topCard ? `🏆 Your most used card is **${topCard.cardName}** (${topCard.bank}) — used **${usage[topId]} times**.\n\n• Reward rate: ${topCard.rewardRate}%\n• Lounge visits left: ${topCard.loungeTotal - topCard.loungeUsed}` : `Couldn't determine most used card.`
    }

    // ── SMART CARD FOR AMOUNT ────────────────────────────────────────────
    if (q.includes('₹') || q.includes('rs') || /\d{3,}/.test(q)) {
        const match = q.match(/[\d,]+/)
        const amt = match ? parseInt(match[0].replace(',', '')) : 1000
        if (!active.length) return `Add cards first to get recommendations!`
        const best = [...active].sort((a, b) => b.rewardRate - a.rewardRate)[0]
        const pts = Math.floor(amt * best.rewardRate / 100)
        const cb = (amt * best.cashbackRate / 100).toFixed(2)
        return `💳 **Best card for ₹${amt.toLocaleString()} purchase:**\n\n**${best.cardName}** (${best.bank})\n• Points you'll earn: **${pts} pts** (worth ${fmtINR(pts * 0.25)})\n• Cashback: **₹${cb}**\n• Reward Rate: **${best.rewardRate}%**\n\n💡 Use this card to get the maximum benefit on this transaction!`
    }

    // ── FALLBACK ─────────────────────────────────────────────────────────
    return `🤔 I didn't quite catch that, ${name}. Here's what I can help with:\n\n• 💳 "Which card for Amazon/Zomato/fuel?"\n• ⭐ "How many points do I have?"\n• ✈️ "How many lounge visits are left?"\n• 💰 "Cashback earned this month?"\n• 📊 "Show my spending summary"\n• 🏆 "Is my card worth the annual fee?"\n• 💡 "Tips to maximize my rewards"\n\nJust type your question!`
}
