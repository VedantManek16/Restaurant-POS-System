import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import logo from "../../assets/logo.png"

const Navbar = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleScroll = (id) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#121212]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logo} alt="Restro POS Logo" className="h-7 w-7 object-contain" />
          <span className="text-lg font-bold tracking-wide text-white">
            RestroDesk<span className="text-[#f6b100]">.</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => handleScroll("features")} className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">Features</button>
          <button onClick={() => handleScroll("how-it-works")} className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">How It Works</button>
          <button onClick={() => handleScroll("pricing")} className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">Pricing</button>
          <button onClick={() => handleScroll("testimonials")} className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">Reviews</button>
          <button onClick={() => handleScroll("faq")} className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">FAQ</button>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")} 
            className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 cursor-pointer transition-colors"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="bg-[#f6b100] hover:bg-[#d99c00] text-black font-semibold cursor-pointer shadow-md shadow-[#f6b100]/10 px-5 py-2"
          >
            Go to App
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-1.5 text-gray-400 hover:text-white cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-[#161616] px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <button onClick={() => handleScroll("features")} className="text-left text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors">Features</button>
          <button onClick={() => handleScroll("how-it-works")} className="text-left text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors">How It Works</button>
          <button onClick={() => handleScroll("pricing")} className="text-left text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors">Pricing</button>
          <button onClick={() => handleScroll("testimonials")} className="text-left text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors">Reviews</button>
          <button onClick={() => handleScroll("faq")} className="text-left text-sm text-gray-300 py-1 hover:text-white cursor-pointer transition-colors">FAQ</button>
          <hr className="border-white/5 my-1" />
          <div className="flex flex-col gap-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth")} 
              className="w-full justify-center text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer py-2.5 h-10 transition-colors"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-full justify-center bg-[#f6b100] hover:bg-[#d99c00] text-black font-semibold cursor-pointer py-2.5 h-10 shadow-md shadow-[#f6b100]/10"
            >
              Go to App
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
