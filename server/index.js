const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001
const SECRET = process.env.JWT_SECRET || 'cardmitra_secret'
const DB_PATH = path.join(__dirname, 'db.json')

// ── Middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// ── JSON Database helpers ──────────────────────────────────────────────
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))

// ── Auth middleware ────────────────────────────────────────────────────
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token' })
    try {
        req.user = jwt.verify(token, SECRET)
        next()
    } catch {
        return res.status(401).json({ error: 'Invalid token' })
    }
}

// ── Auth Routes ────────────────────────────────────────────────────────
// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body
        if (!name || !email || !password) return res.status(400).json({ error: 'Required fields missing' })
        const db = readDB()
        const key = email.toLowerCase()
        if (db.users[key]) return res.status(409).json({ error: 'Email already registered' })
        const hash = await bcrypt.hash(password, 10)
        const user = { id: uuid(), name, email: key, phone: phone || '', passwordHash: hash, joinedAt: new Date().toISOString() }
        db.users[key] = user
        writeDB(db)
        const token = jwt.sign({ id: user.id, email: key }, SECRET, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, name, email: key, phone: user.phone, joinedAt: user.joinedAt } })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const db = readDB()
        const key = email.toLowerCase()
        const user = db.users[key]
        if (!user) return res.status(401).json({ error: 'Invalid credentials' })
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
        const token = jwt.sign({ id: user.id, email: key }, SECRET, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, name: user.name, email: key, phone: user.phone, joinedAt: user.joinedAt } })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// ── Cards Routes ───────────────────────────────────────────────────────
// GET /api/cards
app.get('/api/cards', auth, (req, res) => {
    const db = readDB()
    const cards = db.cards[req.user.id] || []
    res.json(cards)
})

// POST /api/cards
app.post('/api/cards', auth, (req, res) => {
    const db = readDB()
    const card = { ...req.body, id: uuid(), userId: req.user.id, addedAt: new Date().toISOString() }
    if (!db.cards[req.user.id]) db.cards[req.user.id] = []
    db.cards[req.user.id].push(card)
    writeDB(db)
    res.json(card)
})

// DELETE /api/cards/:id
app.delete('/api/cards/:id', auth, (req, res) => {
    const db = readDB()
    if (!db.cards[req.user.id]) return res.status(404).json({ error: 'Not found' })
    db.cards[req.user.id] = db.cards[req.user.id].filter(c => c.id !== req.params.id)
    writeDB(db)
    res.json({ success: true })
})

// PATCH /api/cards/:id/block
app.patch('/api/cards/:id/block', auth, (req, res) => {
    const db = readDB()
    const cards = db.cards[req.user.id] || []
    const idx = cards.findIndex(c => c.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Card not found' })
    cards[idx].isBlocked = true
    writeDB(db)
    res.json(cards[idx])
})

// ── Transactions Routes ────────────────────────────────────────────────
// GET /api/transactions
app.get('/api/transactions', auth, (req, res) => {
    const db = readDB()
    const txns = (db.transactions[req.user.id] || [])
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    res.json(txns)
})

// POST /api/transactions
app.post('/api/transactions', auth, (req, res) => {
    const db = readDB()
    const txn = { ...req.body, id: uuid(), userId: req.user.id, createdAt: new Date().toISOString() }
    if (!db.transactions[req.user.id]) db.transactions[req.user.id] = []
    db.transactions[req.user.id].push(txn)
    writeDB(db)
    res.json(txn)
})

// ── Redemptions Routes ─────────────────────────────────────────────────
// GET /api/redemptions
app.get('/api/redemptions', auth, (req, res) => {
    const db = readDB()
    res.json(db.redemptions[req.user.id] || [])
})

// POST /api/redemptions
app.post('/api/redemptions', auth, (req, res) => {
    const db = readDB()
    const red = { ...req.body, id: uuid(), userId: req.user.id, date: new Date().toISOString() }
    if (!db.redemptions[req.user.id]) db.redemptions[req.user.id] = []
    db.redemptions[req.user.id].push(red)
    writeDB(db)
    res.json(red)
})

// ── Dashboard summary ──────────────────────────────────────────────────
// GET /api/summary
app.get('/api/summary', auth, (req, res) => {
    const db = readDB()
    const txns = db.transactions[req.user.id] || []
    const reds = db.redemptions[req.user.id] || []
    const cards = db.cards[req.user.id] || []

    const totalPoints = txns.reduce((a, t) => a + (t.pointsEarned || 0), 0)
        - reds.reduce((a, r) => a + (r.pointsUsed || 0), 0)
    const totalCashback = txns.reduce((a, t) => a + (t.cashbackEarned || 0), 0)
    const totalSavings = txns.reduce((a, t) => a + (t.savings || 0), 0)
    const totalLounge = cards.reduce((a, c) => a + Math.max(0, (c.loungeTotal || 0) - (c.loungeUsed || 0)), 0)
    const pointsValue = Math.round(Math.max(0, totalPoints) * 0.25)

    res.json({ totalPoints: Math.max(0, totalPoints), totalCashback, totalSavings, totalLounge, pointsValue, cardCount: cards.length, txnCount: txns.length })
})

// ── AI endpoint (rule-based) ───────────────────────────────────────────
app.post('/api/ai', auth, (req, res) => {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'Message required' })
    // The AI engine runs client-side; this endpoint is for future LLM integration
    res.json({ reply: `Received: "${message}". AI is processing on the client side.`, serverProcessed: true })
})

// ── Health check ───────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'CardMitra Backend', version: '1.0.0', timestamp: new Date().toISOString() }))

app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════╗
  ║  💳  CardMitra API Server           ║
  ║  Running on http://localhost:${PORT}   ║
  ║  Database: db.json (JSON Store)     ║
  ╚══════════════════════════════════════╝
  `)
})
