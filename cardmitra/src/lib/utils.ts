export const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

export const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n)

export const maskCard = (last4: string) => `XXXX XXXX XXXX ${last4}`

export const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
}

export const CARD_GRADIENTS = [
    'bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900',
    'bg-gradient-to-br from-purple-900 via-violet-800 to-emerald-700',
    'bg-gradient-to-br from-rose-800 via-rose-700 to-purple-900',
    'bg-gradient-to-br from-teal-900 via-teal-700 to-green-600',
    'bg-gradient-to-br from-gray-800 via-gray-700 to-blue-600',
]

export const CATEGORY_ICONS: Record<string, string> = {
    Shopping: '🛒',
    Travel: '✈️',
    Food: '🍽️',
    Entertainment: '🎬',
    Fuel: '⛽',
    Utilities: '⚡',
    Groceries: '🛍️',
    Other: '📦',
}

export const CATEGORY_COLORS: Record<string, string> = {
    Shopping: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    Travel: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    Fuel: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    Utilities: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    Groceries: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300',
}

export const BANK_HELPLINES: Record<string, string> = {
    'HDFC Bank': '1800-202-6161',
    'ICICI Bank': '1800-102-4242',
    'SBI': '1800-11-2211',
    'Axis Bank': '1800-419-5959',
    'Kotak Mahindra': '1860-266-2666',
    'Yes Bank': '1800-1200',
    'IndusInd Bank': '1860-267-7777',
    'American Express': '1800-419-2122',
    'Citibank': '1800-267-2425',
    'Standard Chartered': '6601-4444',
}

export const DEALS_DATA = [
    { id: 'd1', brand: 'boAt', category: 'electronics', discount: 15, cashback: 5, logo: '🎧', price: 2999, originalPrice: 3499, desc: 'Rockerz 450 Pro Bluetooth Headphones' },
    { id: 'd2', brand: 'Noise', category: 'electronics', discount: 20, cashback: 8, logo: '⌚', price: 1999, originalPrice: 2499, desc: 'ColorFit Ultra 3 Smartwatch' },
    { id: 'd3', brand: 'Fire-Boltt', category: 'electronics', discount: 18, cashback: 6, logo: '⌚', price: 1299, originalPrice: 1599, desc: 'Phoenix Ultra Smartwatch' },
    { id: 'd4', brand: 'Skullcandy', category: 'electronics', discount: 25, cashback: 10, logo: '🎵', price: 1499, originalPrice: 1999, desc: 'Indy ANC True Wireless Earbuds' },
    { id: 'd5', brand: 'Samsung', category: 'electronics', discount: 10, cashback: 5, logo: '📱', price: 24999, originalPrice: 27999, desc: 'Galaxy A55 5G Smartphone' },
    { id: 'd6', brand: 'Apple', category: 'electronics', discount: 5, cashback: 3, logo: '🍎', price: 69900, originalPrice: 73900, desc: 'iPhone 15 128GB' },
    { id: 'd7', brand: 'Mamaearth', category: 'health', discount: 30, cashback: 12, logo: '🌿', price: 599, originalPrice: 849, desc: 'Vitamin C Face Wash Combo' },
    { id: 'd8', brand: 'Mamaearth', category: 'health', discount: 25, cashback: 10, logo: '💆', price: 799, originalPrice: 1099, desc: 'Onion Hair Oil + Shampoo Kit' },
    { id: 'd9', brand: 'Amazon', category: 'ecommerce', discount: 12, cashback: 4, logo: '📦', price: 0, originalPrice: 0, desc: 'Extra 12% off on ₹2000+ orders' },
    { id: 'd10', brand: 'Flipkart', category: 'ecommerce', discount: 15, cashback: 6, logo: '🛒', price: 0, originalPrice: 0, desc: '15% cashback on electronics' },
    { id: 'd11', brand: 'Myntra', category: 'fashion', discount: 40, cashback: 8, logo: '👗', price: 0, originalPrice: 0, desc: '40% off on top brands + 8% cashback' },
    { id: 'd12', brand: 'Myntra', category: 'fashion', discount: 50, cashback: 10, logo: '👟', price: 0, originalPrice: 0, desc: 'End of Reason Sale – Footwear' },
]

export const BENEFITS_DATA = [
    { key: 'airport_lounge', label: 'Airport Lounge', icon: '✈️', desc: 'Complimentary airport lounge access worldwide' },
    { key: 'railway_lounge', label: 'Railway Lounge', icon: '🚂', desc: 'Access to premium railway lounges across India' },
    { key: 'travel_insurance', label: 'Travel Insurance', icon: '🛡️', desc: 'Complimentary air accident & travel insurance' },
    { key: 'fuel_waiver', label: 'Fuel Surcharge Waiver', icon: '⛽', desc: '1% fuel surcharge waiver at all petrol pumps' },
    { key: 'dining', label: 'Dining Discounts', icon: '🍽️', desc: 'Up to 15% off at partner restaurants' },
    { key: 'movies', label: 'Movie Offers', icon: '🎬', desc: 'Buy 1 Get 1 on movie tickets (BookMyShow/PVR)' },
    { key: 'hotels', label: 'Hotel Benefits', icon: '🏨', desc: 'Up to 20% off on hotel bookings' },
    { key: 'shopping', label: 'Shopping Rewards', icon: '🛒', desc: 'Accelerated reward points on online shopping' },
    { key: 'emi', label: 'EMI Offers', icon: '💳', desc: 'Zero cost EMI on select purchases' },
    { key: 'ott', label: 'OTT Subscriptions', icon: '📺', desc: 'Free Netflix/Prime/Hotstar subscriptions' },
    { key: 'golf', label: 'Golf Privileges', icon: '⛳', desc: 'Complimentary golf rounds at partner courses' },
    { key: 'cashback_merchant', label: 'Merchant Cashback', icon: '💰', desc: 'Exclusive cashback at partner merchants' },
]

export const COMPARE_CATEGORIES = [
    { cat: 'Shopping', icon: '🛒' },
    { cat: 'Travel', icon: '✈️' },
    { cat: 'Fuel', icon: '⛽' },
    { cat: 'Food', icon: '🍽️' },
    { cat: 'Groceries', icon: '🛍️' },
    { cat: 'Utilities', icon: '⚡' },
    { cat: 'Online', icon: '💻' },
]
