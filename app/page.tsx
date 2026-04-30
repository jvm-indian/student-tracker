import { ChevronDown } from "lucide-react"

export default function Web3HeroPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap');
        .font-general-sans {
          font-family: 'General Sans', sans-serif;
        }
      `}} />
      <main className="relative min-h-screen bg-black overflow-hidden font-general-sans text-white">
        {/* Background Video */}
        <video 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* Navbar */}
        <nav className="relative z-10 w-full flex items-center justify-between px-6 md:px-[120px] py-[20px]">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-[25px] font-bold tracking-widest leading-none w-[187px]">
              LOGOIPSUM
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-[30px]">
            {['Get Started', 'Developers', 'Features', 'Resources'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="flex items-center gap-[14px] text-[14px] font-medium text-white hover:text-white/80 transition-colors"
              >
                {item}
                <ChevronDown className="w-[14px] h-[14px]" />
              </a>
            ))}
          </div>

          {/* Join Waitlist Button - Nav */}
          <button className="relative inline-flex rounded-full p-[0.6px] bg-white/30 overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
            {/* Subtle glow streak on top edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-white opacity-60 blur-[2px] group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 bg-black rounded-full px-[29px] py-[11px] text-white text-[14px] font-medium">
              Join Waitlist
            </div>
          </button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center w-full pt-[200px] md:pt-[280px] pb-[102px] px-6">
          <div className="flex flex-col items-center gap-[40px] w-full">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-[20px] bg-white/10 border border-white/20 px-3 py-1.5 backdrop-blur-sm">
              <div className="w-1 h-1 bg-white rounded-full ml-1" />
              <span className="text-[13px] font-medium pr-1">
                <span className="text-white/60">Early access available from</span>
                <span className="text-white"> May 1, 2026</span>
              </span>
            </div>

            {/* Heading and Subtitle */}
            <div className="flex flex-col items-center gap-[24px]">
              <h1 
                className="text-[36px] md:text-[56px] font-medium text-center leading-[1.28] max-w-[613px]"
                style={{
                  background: 'linear-gradient(144.5deg, rgba(255,255,255,1) 28%, rgba(0,0,0,0) 115%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Web3 at the Speed of Experience
              </h1>
              
              <p className="text-[15px] font-normal text-white/70 max-w-[680px] text-center leading-relaxed">
                Powering seamless experiences and real-time connections, EOS is the base for creators who move with purpose, leveraging resilience, speed, and scale to shape the future.
              </p>
            </div>

            {/* CTA Button */}
            <button className="relative inline-flex rounded-full p-[0.6px] bg-white/30 overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
              {/* Subtle glow streak on top edge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] bg-white opacity-80 blur-[2px] group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 bg-white rounded-full px-[29px] py-[11px] text-black text-[14px] font-medium">
                Join Waitlist
              </div>
            </button>

          </div>
        </div>
      </main>
    </>
  )
}
