import React from "react"
import { Zap, LayoutGrid, ChefHat, TrendingUp } from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card"

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-28 border-t border-white/5 bg-[#141414]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wider text-[#f6b100]">Features Built to Scale</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Everything you need to run a flawless shift
          </p>
          <p className="mt-4 text-base text-gray-400">
            We ditched the heavy corporate bloat. Restro POS gives you only the features that actually make you money.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Feature 1 */}
          <Card className="bg-[#181818] border-white/5 hover:border-[#f6b100]/30 transition-all group duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[#f6b100]/10 text-[#f6b100] group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <div>
                <CardTitle className="text-white font-bold text-base">Lightning-Fast Billing</CardTitle>
                <CardDescription className="text-gray-500">Punch order details and print receipts in 2 clicks.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-gray-400 text-sm leading-relaxed">
              Our optimized keyboard workflow and layout allow cashiers and servers to place orders in seconds. Reduce order errors by 90% and keep lines moving quickly during busy dinner rushes.
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-[#181818] border-white/5 hover:border-[#f6b100]/30 transition-all group duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[#f6b100]/10 text-[#f6b100] group-hover:scale-110 transition-transform">
                <LayoutGrid size={20} />
              </div>
              <div>
                <CardTitle className="text-white font-bold text-base">Visual Table Management</CardTitle>
                <CardDescription className="text-gray-500">Keep track of tables, bookings, and statuses.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-gray-400 text-sm leading-relaxed">
              Color-coded layout helps hostesses see at a glance which tables are occupied, dirty, reserved, or ready for guest seating. Turn tables faster and maximize cover counts.
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-[#181818] border-white/5 hover:border-[#f6b100]/30 transition-all group duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[#f6b100]/10 text-[#f6b100] group-hover:scale-110 transition-transform">
                <ChefHat size={20} />
              </div>
              <div>
                <CardTitle className="text-white font-bold text-base">Integrated Kitchen Displays</CardTitle>
                <CardDescription className="text-gray-500">Real-time status updates sync with cooks instantly.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-gray-400 text-sm leading-relaxed">
              No more lost paper tickets or screaming over hot grills. Orders are sent directly to kitchen screens immediately with custom modifiers and preparation timers.
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-[#181818] border-white/5 hover:border-[#f6b100]/30 transition-all group duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[#f6b100]/10 text-[#f6b100] group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <div>
                <CardTitle className="text-white font-bold text-base">Instant Sales Analytics</CardTitle>
                <CardDescription className="text-gray-500">Understand hot-selling dishes and revenue metrics.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-gray-400 text-sm leading-relaxed">
              Access daily revenue summaries, check-size reports, and staff performance metrics. Understand your best-selling items, menu profitability margins, and optimize inventory easily.
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}

export default Features
