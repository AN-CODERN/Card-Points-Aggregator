import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { generateId } from '../lib/utils'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Auth() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(false)   // false = sign-in panel, true = sign-up panel

    // Sign In
    const [siEmail, setSiEmail] = useState('')
    const [siPass, setSiPass] = useState('')
    // Sign Up
    const [suName, setSuName] = useState('')
    const [suEmail, setSuEmail] = useState('')
    const [suPhone, setSuPhone] = useState('')
    const [suPass, setSuPass] = useState('')

    const login = useStore(s => s.login)
    const nav = useNavigate()

    // Keep the class in sync — this drives ALL the CSS animations
    useEffect(() => {
        containerRef.current?.classList.toggle('active', active)
    }, [active])

    const getUsers = (): Record<string, {
        id: string; name: string; phone: string; password: string; joinedAt: string
    }> => JSON.parse(localStorage.getItem('cardmitra-users') || '{}')

    const doSignin = () => {
        if (!siEmail || !siPass) return toast.error('Please fill all fields')
        const users = getUsers()
        const user = users[siEmail.toLowerCase()]
        if (!user || user.password !== btoa(siPass)) return toast.error('Invalid email or password')
        login({ id: user.id, name: user.name, email: siEmail.toLowerCase(), phone: user.phone, joinedAt: user.joinedAt })
        toast.success(`Welcome back, ${user.name}! 👋`)
        nav('/dashboard')
    }

    const doSignup = () => {
        if (!suName || !suEmail || !suPass) return toast.error('Please fill required fields')
        if (suPass.length < 6) return toast.error('Password must be at least 6 characters')
        const users = getUsers()
        const key = suEmail.toLowerCase()
        if (users[key]) return toast.error('Email already registered. Please sign in.')
        const newUser = {
            id: generateId(), name: suName, phone: suPhone,
            password: btoa(suPass), joinedAt: new Date().toISOString()
        }
        users[key] = newUser
        localStorage.setItem('cardmitra-users', JSON.stringify(users))
        login({ id: newUser.id, name: suName, email: key, phone: suPhone, joinedAt: newUser.joinedAt })
        toast.success(`Welcome to CardMitra, ${suName}! 🎉`)
        nav('/dashboard')
    }

    return (
        <div className="auth-page">
            {/* Brand above the card — extra touch on top of your original */}
            <div className="auth-brand">
                <div className="brand-logo-icon">💳</div>
                <span className="brand-name-text">CardMitra</span>
                <span className="brand-tagline-text">Your Personal Rewards Expert</span>
            </div>

            {/* ── YOUR ORIGINAL CONTAINER — untouched structure ── */}
            <div className="container" id="container" ref={containerRef}>

                {/* ── SIGN UP PANEL ── */}
                <div className="sign-up">
                    <form onSubmit={e => { e.preventDefault(); doSignup() }}>
                        <h1>Create Account</h1>
                        <div className="icons">
                            <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
                        </div>
                        <span>or use email for registration</span>
                        <input
                            type="text" placeholder="Name"
                            value={suName} onChange={e => setSuName(e.target.value)} required
                        />
                        <input
                            type="email" placeholder="Email"
                            value={suEmail} onChange={e => setSuEmail(e.target.value)} required
                        />
                        <input
                            type="tel" placeholder="Mobile Number"
                            value={suPhone} onChange={e => setSuPhone(e.target.value)}
                        />
                        <input
                            type="password" placeholder="Password"
                            value={suPass} onChange={e => setSuPass(e.target.value)} required
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                {/* ── SIGN IN PANEL ── */}
                <div className="sign-in">
                    <form onSubmit={e => { e.preventDefault(); doSignin() }}>
                        <h1>Sign In</h1>
                        <div className="icons">
                            <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
                        </div>
                        <span>or use email password</span>
                        <input
                            type="email" placeholder="Email"
                            value={siEmail} onChange={e => setSiEmail(e.target.value)} required
                        />
                        <input
                            type="password" placeholder="Password"
                            value={siPass} onChange={e => setSiPass(e.target.value)} required
                        />
                        <a href="#" className="forgot-link">Forgot password</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                {/* ── TOGGLE PANEL — your exact original markup ── */}
                <div className="toogle-container">
                    <div className="toogle">

                        {/* Left panel — shown when active (register mode) → click to go back to sign-in */}
                        <div className="toogle-panel toogle-left">
                            <h1>Welcome User!</h1>
                            <p>If you already have an account</p>
                            <button className="hidden" onClick={() => setActive(false)}>Sign In</button>
                        </div>

                        {/* Right panel — shown by default → click to go to sign-up */}
                        <div className="toogle-panel toogle-right">
                            <h1>Hello, User!</h1>
                            <p>If you don't have an account</p>
                            <button className="hidden" onClick={() => setActive(true)}>Register</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
