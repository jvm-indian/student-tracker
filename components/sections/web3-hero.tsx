'use client'

import Link from 'next/link'

export function Web3Hero() {
  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden font-general-sans selection:bg-white/20">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4" type="video/mp4" />
      </video>

      {/* 50% Black Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-6 pt-[200px] md:pt-[280px] pb-[102px]">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[20px] bg-white/10 border border-white/20 mb-10 backdrop-blur-sm">
          <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <span className="text-[13px] font-medium text-white/60">
            Early access available from
          </span>
          <span className="text-[13px] font-medium text-white">
            May 1, 2026
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-[36px] md:text-[56px] font-medium leading-[1.28] tracking-tight max-w-[613px] text-gradient-144 mb-6">
          Web3 at the Speed of Experience
        </h1>

        {/* Subtitle */}
        <p className="text-center text-[15px] font-normal text-white/70 max-w-[680px] leading-relaxed mb-10">
          Powering seamless experiences and real-time connections, EOS is the base for creators who move with purpose, leveraging resilience, speed, and scale to shape the future.
        </p>

        {/* CTA Button */}
        <Link href="/auth/login">
          <button className="pill-glow-light text-black text-[14px] font-medium px-[29px] py-[11px] transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgba(255,255,255,0.39)]">
            Join Waitlist
          </button>
        </Link>
      </div>
    </section>
  )
}
