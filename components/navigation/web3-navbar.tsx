'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export function Web3Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-[120px] py-[20px] font-general-sans">
      {/* Left side: Logo and Links */}
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-white font-bold text-xl tracking-widest uppercase" style={{ width: '187px', height: '25px', display: 'flex', alignItems: 'center' }}>
            LOGOIPSUM
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-[30px]">
          {['Get Started', 'Developers', 'Features', 'Resources'].map((item) => (
            <Link 
              key={item} 
              href="#" 
              className="text-white text-[14px] font-medium flex items-center gap-[14px] hover:text-white/80 transition-colors"
            >
              {item}
              <ChevronDown className="w-[14px] h-[14px]" strokeWidth={2.5} />
            </Link>
          ))}
        </div>
      </div>

      {/* Right side: Button */}
      <Link href="/auth/login">
        <button className="pill-glow-dark text-white text-[14px] font-medium px-[29px] py-[11px] transition-transform hover:scale-105 active:scale-95">
          Join Waitlist
        </button>
      </Link>
    </nav>
  )
}
