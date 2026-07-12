import React from "react"
import { useNavigate } from "react-router-dom"
import {
  House,
  ArrowLeft,
  ShieldAlert,
  Lock,
  Store
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const AccessDenied = () => {
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
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.05),transparent_60%)] blur-3xl"></div>
      </div>

      {/* Spacer */}
      <div></div>

      {/* Main Container */}
      <main className="mx-auto max-w-md w-full px-6 flex flex-col items-center text-center py-12">
        {/* 403 Badge */}
        <Badge className="bg-red-500/10 hover:bg-red-500/10 text-red-500 border border-red-500/25 px-4 py-1 rounded-full text-xs font-bold tracking-wider mb-5 shadow-sm shadow-red-500/5">
          STATUS CODE: 403
        </Badge>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Access Denied
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-sm text-gray-400 max-w-xs font-light leading-relaxed">
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* POS Illustration Card */}
        <div className="mt-8 w-full max-w-xs">
          <Card className="bg-[#181818] border-white/5 shadow-2xl p-6 relative overflow-hidden flex flex-col items-center gap-4">
            {/* Screen Header */}
            <div className="w-full flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-gray-600 font-mono">
              <span className="flex items-center gap-1"><Store size={10} className="text-red-500" /> Security Console</span>
              <span className="text-red-500">Restricted Route</span>
            </div>

            {/* Visual lock and shield illustration */}
            <div className="relative py-6 flex items-center justify-center w-full">
              {/* Box background mockup */}
              <div className="w-32 h-44 bg-[#1f1f1f] rounded-lg border border-white/5 p-3 flex flex-col gap-2 relative opacity-30">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                  <Lock size={12} className="text-gray-500" />
                  <div className="h-1.5 w-12 bg-white/5 rounded"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 w-16 bg-white/5 rounded"></div>
                  <div className="h-1 w-20 bg-white/5 rounded"></div>
                  <div className="h-1 w-14 bg-white/5 rounded"></div>
                </div>
              </div>

              {/* Centered ShieldAlert Overlay */}
              <div className="absolute bg-[#121212]/90 border border-red-500/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg shadow-black/50 animate-pulse">
                <ShieldAlert size={32} className="text-red-500 animate-bounce duration-1000" />
                <span className="text-[10px] text-red-500 font-semibold mt-2 tracking-wide uppercase">403 FORBIDDEN</span>
              </div>
            </div>

            {/* Error Message */}
            <div className="w-full text-center">
              <p className="text-xs text-gray-500 font-mono">ERR_RBAC_INSUFFICIENT_PERMS</p>
            </div>
          </Card>
        </div>

        {/* Separator */}
        <Separator className="bg-white/5 my-8" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto bg-[#f6b100] hover:bg-[#d99c00] text-black font-bold text-xs py-4 px-6 rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#f6b100]/5 transition-all scale-100 hover:scale-[1.02]"
          >
            <House size={14} /> Back to Dashboard
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
        &copy; 2026 RestroDesk Platform.
      </footer>

    </div>
  )
}

export default AccessDenied
