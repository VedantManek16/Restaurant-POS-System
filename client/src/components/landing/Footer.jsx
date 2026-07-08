import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import logo from "../../assets/logo.png"

const Footer = () => {
  const navigate = useNavigate()

  const handleScroll = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-[#0b0b0b] border-t border-white/5 py-12 md:py-16 text-gray-500 text-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & Pitch */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Restro POS Logo" className="h-6 w-6 object-contain" />
            <span className="text-md font-bold tracking-wide text-white">
              Restro<span className="text-[#f6b100]">.</span>
            </span>
          </div>
          <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
            Beautiful, light, cloud-hosted POS designed specifically for independent cafes, diners, bistros, and small restaurants.
          </p>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Restro POS Inc. All rights reserved.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h6 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Product</h6>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button 
                onClick={() => handleScroll("features")} 
                className="hover:text-white cursor-pointer text-left w-full"
              >
                Features
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleScroll("how-it-works")} 
                className="hover:text-white cursor-pointer text-left w-full"
              >
                How It Works
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleScroll("pricing")} 
                className="hover:text-white cursor-pointer text-left w-full"
              >
                Pricing
              </button>
            </li>
            <li>
              <Button 
                onClick={() => navigate("/dashboard")} 
                variant="link" 
                className="p-0 text-gray-500 hover:text-white h-auto font-normal text-xs decoration-transparent"
              >
                Access Demo
              </Button>
            </li>
          </ul>
        </div>

        {/* Legal / Socials */}
        <div>
          <h6 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Support & Legal</h6>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Email Support</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

      </div>
    </footer>
  )
}

export default Footer
