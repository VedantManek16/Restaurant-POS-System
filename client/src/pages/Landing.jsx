import React from "react"
import Navbar from "../components/landing/Navbar"
import Hero from "../components/landing/Hero"
import Features from "../components/landing/Features"
import HowItWorks from "../components/landing/HowItWorks"
import Pricing from "../components/landing/Pricing"
import Testimonials from "../components/landing/Testimonials"
import FAQ from "../components/landing/FAQ"
import CTA from "../components/landing/CTA"
import Footer from "../components/landing/Footer"

const Landing = () => {
  React.useEffect(() => {
    document.documentElement.classList.add("scrollbar-hide")
    return () => {
      document.documentElement.classList.remove("scrollbar-hide")
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#121212] text-[#f5f5f5] font-sans selection:bg-[#f6b100] selection:text-black antialiased">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

export default Landing
