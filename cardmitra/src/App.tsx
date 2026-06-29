import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from './store/useStore'
import BottomNav from './components/ui/BottomNav'

// Pages
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import AddCard from './pages/AddCard'
import AddTransaction from './pages/AddTransaction'
import Transactions from './pages/Transactions'
import Benefits from './pages/Benefits'
import Rewards from './pages/Rewards'
import AI from './pages/AI'
import Deals from './pages/Deals'
import Care from './pages/Care'
import Profile from './pages/Profile'

// Pages without bottom nav
const NO_NAV_ROUTES = ['/auth', '/add-card', '/add-transaction', '/ai', '/profile', '/deals', '/care']

function AppShell() {
    const { isAuthenticated, darkMode } = useStore()
    const { pathname } = useLocation()
    const nav = useNavigate()

    // Apply dark mode on mount
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode)
    }, [darkMode])

    // Redirect unauthenticated users to auth
    useEffect(() => {
        if (!isAuthenticated && pathname !== '/auth') nav('/auth')
    }, [isAuthenticated, pathname])

    const showNav = isAuthenticated && !NO_NAV_ROUTES.some(r => pathname.startsWith(r))

    return (
        <div className="relative">
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
                <Route path="/add-card" element={isAuthenticated ? <AddCard /> : <Navigate to="/auth" />} />
                <Route path="/add-transaction" element={isAuthenticated ? <AddTransaction /> : <Navigate to="/auth" />} />
                <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/auth" />} />
                <Route path="/benefits" element={isAuthenticated ? <Benefits /> : <Navigate to="/auth" />} />
                <Route path="/rewards" element={isAuthenticated ? <Rewards /> : <Navigate to="/auth" />} />
                <Route path="/ai" element={isAuthenticated ? <AI /> : <Navigate to="/auth" />} />
                <Route path="/deals" element={isAuthenticated ? <Deals /> : <Navigate to="/auth" />} />
                <Route path="/care" element={isAuthenticated ? <Care /> : <Navigate to="/auth" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/auth'} />} />
            </Routes>
            {showNav && <BottomNav />}
        </div>
    )
}

export default function App() {
    return <AppShell />
}
