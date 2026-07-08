import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"

const Pricing = () => {
  const navigate = useNavigate()
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section id="pricing" className="py-20 md:py-28 border-t border-white/5 bg-[#141414]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wider text-[#f6b100]">Fair & Simple Pricing</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Tuned to fit your restaurant budget
          </p>
          <p className="mt-4 text-base text-gray-400">
            No hidden transaction percentages, no contract locks. Switch or cancel your subscription whenever you want.
          </p>

          {/* Toggle Billing Period */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#f6b100] focus:ring-offset-2 focus:ring-offset-black"
              style={{ backgroundColor: isAnnual ? '#f6b100' : '' }}
            >
              <span 
                className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" 
                style={{ transform: isAnnual ? 'translateX(20px)' : 'translateX(0px)', backgroundColor: isAnnual ? '#000' : '#fff' }}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white font-semibold' : 'text-gray-400'} flex items-center gap-1.5`}>
              Yearly <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0 px-2 rounded-full text-[10px]">Save 20%</Badge>
            </span>
          </div>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Starter Plan */}
          <Card className="bg-[#181818]/60 border-white/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-white text-xl font-bold">Starter Plan</CardTitle>
              <CardDescription className="text-gray-500">Perfect for food trucks, coffee stands, or small cafes.</CardDescription>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">${isAnnual ? '24' : '29'}</span>
                <span className="text-gray-500 ml-1 text-sm">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="mt-2 flex-grow">
              <ul className="space-y-4">
                {['1 Active Register', 'Up to 15 Tables', 'Menu Management', 'Standard Email Support', 'Daily Sales Reports'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-[#f6b100] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="bg-transparent border-t-0 p-6 pt-2">
              <Button 
                onClick={() => navigate("/dashboard")} 
                variant="outline" 
                className="w-full justify-center border-white/10 hover:bg-white/5 hover:text-white py-5 text-sm"
              >
                Choose Starter
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-[#1c1c1c] border-[#f6b100]/30 shadow-xl shadow-[#f6b100]/5 flex flex-col justify-between relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-[#f6b100] text-black text-[10px] font-black tracking-wider uppercase px-4 py-1.5 rounded-bl-lg shadow-sm">
                Most Popular
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white text-xl font-bold">Pro Growth</CardTitle>
              <CardDescription className="text-gray-400">Best choice for bistros, bars, or fast-casual diners.</CardDescription>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">${isAnnual ? '64' : '79'}</span>
                <span className="text-gray-400 ml-1 text-sm">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="mt-2 flex-grow">
              <ul className="space-y-4">
                {['Unlimited Active Registers', 'Unlimited Dining Tables', 'Integrated Kitchen Display Queue', 'Priority 24/7 Phone Support', 'Advanced Financial Analytics', 'Custom Recipe Inventory Management'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-200">
                    <Check size={16} className="text-[#f6b100] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="bg-transparent border-t-0 p-6 pt-2">
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="w-full justify-center bg-[#f6b100] hover:bg-[#d99c00] text-black font-bold py-5 text-sm"
              >
                Start 14-Day Free Trial
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </section>
  )
}

export default Pricing
