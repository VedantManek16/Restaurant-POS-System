import React from "react"
import { useNavigate } from "react-router-dom"
import { Play, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const Hero = () => {
  const navigate = useNavigate()

  const handleScroll = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Amber Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden pointer-events-none">
        <div className="w-[1000px] h-[400px] rounded-full bg-[radial-gradient(circle_at_top,rgba(246,177,0,0.12),transparent_60%)] blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Tagline Badge */}
        <Badge className="bg-[#f6b100]/10 hover:bg-[#f6b100]/10 text-[#f6b100] border border-[#f6b100]/20 px-3.5 py-1 rounded-full text-xs font-semibold mb-6 flex items-center gap-1.5 shadow-sm shadow-[#f6b100]/5">
          <Sparkles size={12} /> Real-time Restaurant Billing & Management
        </Badge>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl text-white">
          The Smart POS System <br className="hidden sm:inline" /> 
          for <span className="bg-gradient-to-r from-[#f6b100] via-[#ffd059] to-[#f6b100] bg-clip-text text-transparent">Modern Restaurants</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
          Speed up billing, coordinate tables seamlessly, track live kitchen orders, and boost your profit margins—all on a gorgeous, minimalistic screen.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")} 
            className="w-full sm:w-auto bg-[#f6b100] hover:bg-[#d99c00] text-black font-bold text-sm px-8 py-5 rounded-lg shadow-lg shadow-[#f6b100]/10 transition-all cursor-pointer scale-100 hover:scale-[1.02]"
          >
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => handleScroll("how-it-works")} 
            className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-sm px-6 py-5 rounded-lg cursor-pointer"
          >
            <Play size={14} className="fill-white mr-1.5" /> Watch Demo
          </Button>
        </div>

        {/* Micro Trust Indicators */}
        <div className="mt-8 flex items-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-[#f6b100]" /> No Credit Card Required</span>
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-[#f6b100]" /> Setup in 5 Minutes</span>
        </div>

        {/* Dashboard Preview (Pure CSS Illustration - Rich Aesthetics) */}
        <div className="mt-16 w-full max-w-5xl rounded-xl border border-white/5 bg-[#181818]/60 p-2 shadow-2xl shadow-black/80 backdrop-blur-sm">
          <div className="rounded-lg border border-white/5 bg-[#141414] overflow-hidden">
            {/* Fake App Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1c1c1c] border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                <span className="text-[10px] text-gray-500 ml-4 font-mono">restro-pos-dashboard</span>
              </div>
              <div className="h-4 w-40 bg-white/5 rounded-full"></div>
              <div className="h-4 w-8 bg-[#f6b100]/20 rounded-full"></div>
            </div>

            {/* Fake App Body */}
            <div className="grid grid-cols-3 gap-3 p-4 text-left">
              {/* Left Side: Stats and Orders */}
              <div className="col-span-2 flex flex-col gap-3">
                {/* Cards Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total Sales</p>
                      <h4 className="text-lg font-bold text-white mt-1">$1,482.50</h4>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">+12%</div>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Active Tables</p>
                      <h4 className="text-lg font-bold text-white mt-1">11 / 15</h4>
                    </div>
                    <div className="p-2 rounded-lg bg-[#f6b100]/10 text-[#f6b100] text-xs font-semibold">Busy</div>
                  </div>
                </div>
                {/* Recent Orders List Mockup */}
                <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-xs font-semibold text-white">Live Orders</h5>
                    <span className="text-[9px] text-[#f6b100] bg-[#f6b100]/10 px-2 py-0.5 rounded-full">4 cooking</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs py-2 px-3 bg-[#1e1e1e] rounded border-l-2 border-yellow-500">
                      <span className="font-medium text-white">Table 4 — Burger & Fries</span>
                      <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">In Prep</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2 px-3 bg-[#1e1e1e] rounded border-l-2 border-blue-500">
                      <span className="font-medium text-white">Table 12 — Salmon Steak</span>
                      <span className="text-[10px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">Ready</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-2 px-3 bg-[#1e1e1e] rounded border-l-2 border-emerald-500">
                      <span className="font-medium text-white">Takeaway #284 — Pasta</span>
                      <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Served</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Popular items / Billing */}
              <div className="col-span-1 bg-[#1a1a1a] p-4 rounded-lg border border-white/5 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-white mb-3">Current Cart</h5>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">1x Spicy Chicken Wings</span>
                      <span className="text-white font-medium">$12.99</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">2x Double Cheeseburger</span>
                      <span className="text-white font-medium">$21.98</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">1x Diet Coke</span>
                      <span className="text-white font-medium">$2.50</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3 mt-4">
                  <div className="flex justify-between text-xs font-bold text-white mb-3">
                    <span>Total Due</span>
                    <span>$37.47</span>
                  </div>
                  <div className="w-full bg-[#f6b100] text-black text-center font-bold py-2 rounded text-xs">
                    Process Bill ($)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
