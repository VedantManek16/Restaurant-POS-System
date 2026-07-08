import React from "react"
import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const CTA = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 md:py-24 border-t border-white/5 bg-[#121212] relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#2a220c] to-[#120f06] border border-[#f6b100]/25 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Visual Ring Overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#f6b100]/5 -z-10 translate-x-20 -translate-y-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/40 -z-10 -translate-x-20 translate-y-20 blur-2xl"></div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to streamline your restaurant shift?
          </h3>
          <p className="mt-4 text-base text-gray-300 max-w-xl mx-auto font-light">
            Get started with Restro POS today. Setup takes 5 minutes, and you can try all Pro features free for 14 days.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your restaurant email" 
              className="bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f6b100] w-full"
            />
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="bg-[#f6b100] hover:bg-[#d99c00] text-black font-bold text-sm px-6 py-3 rounded-lg w-full sm:w-auto transition-all duration-200"
            >
              Get Started
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Star className="text-[#f6b100] fill-[#f6b100]" size={12} />
            <span>4.9/5 overall customer satisfaction rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
