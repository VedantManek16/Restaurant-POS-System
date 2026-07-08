import React from "react"
import { useNavigate } from "react-router-dom"
import { 
  House, 
  ArrowLeft, 
  Receipt, 
  Store, 
  SearchX 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const NotFound = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    document.documentElement.classList.add("scrollbar-hide")
    return () => {
      document.documentElement.classList.remove("scrollbar-hide")
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#121212] text-[#f5f5f5] font-sans antialiased relative overflow-hidden flex flex-col justify-between select-none">
      
      {/* Glow Effects */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(246,177,0,0.05),transparent_60%)] blur-3xl"></div>
      </div>

      {/* Header Placeholder (To align center container vertically) */}
      <div></div>

      {/* Main Container */}
      <main className="mx-auto max-w-md w-full px-6 flex flex-col items-center text-center py-12">
        {/* 404 Badge */}
        <Badge className="bg-[#f6b100]/10 hover:bg-[#f6b100]/10 text-[#f6b100] border border-[#f6b100]/25 px-4 py-1 rounded-full text-xs font-bold tracking-wider mb-5 shadow-sm shadow-[#f6b100]/5">
          STATUS CODE: 404
        </Badge>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Oops! Page Not Found
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-sm text-gray-400 max-w-xs font-light leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* POS Illustration Card */}
        <div className="mt-8 w-full max-w-xs">
          <Card className="bg-[#181818] border-white/5 shadow-2xl p-6 relative overflow-hidden flex flex-col items-center gap-4">
            {/* Screen Header */}
            <div className="w-full flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-gray-600 font-mono">
              <span className="flex items-center gap-1"><Store size={10} className="text-[#f6b100]" /> Outlet #01</span>
              <span>Register Active</span>
            </div>

            {/* Visual Receipt and Search Illustration */}
            <div className="relative py-6 flex items-center justify-center w-full">
              {/* Receipt Background Mockup */}
              <div className="w-32 h-44 bg-[#1f1f1f] rounded-lg border border-white/5 p-3 flex flex-col gap-2 relative opacity-50">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                  <Receipt size={12} className="text-gray-500" />
                  <div className="h-1.5 w-12 bg-white/5 rounded"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 w-16 bg-white/5 rounded"></div>
                  <div className="h-1 w-20 bg-white/5 rounded"></div>
                  <div className="h-1 w-14 bg-white/5 rounded"></div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 border-t border-white/5 pt-1.5 flex justify-between">
                  <div className="h-1.5 w-6 bg-white/5 rounded"></div>
                  <div className="h-1.5 w-8 bg-[#f6b100]/25 rounded"></div>
                </div>
              </div>

              {/* Centered SearchX Error Overlay */}
              <div className="absolute bg-[#121212]/90 border border-[#f6b100]/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg shadow-black/50 animate-bounce duration-1000">
                <SearchX size={32} className="text-[#f6b100]" />
                <span className="text-[10px] text-gray-400 font-semibold mt-2 tracking-wide uppercase">No Record Found</span>
              </div>
            </div>

            {/* Error Message */}
            <div className="w-full text-center">
              <p className="text-xs text-gray-500 font-mono">ERR_ROUTE_NOT_RESOLVED</p>
            </div>
          </Card>
        </div>

        {/* Separator */}
        <Separator className="bg-white/5 my-8" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full sm:w-auto bg-[#f6b100] hover:bg-[#d99c00] text-black font-bold text-xs py-4 px-6 rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#f6b100]/5 transition-all scale-100 hover:scale-[1.02]"
          >
            <House size={14} /> Back to Home
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs py-4 px-6 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={14} /> Go Back
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-600 border-t border-white/5">
        &copy; 2026 RestroFlow.
      </footer>

    </div>
  )
}

export default NotFound
