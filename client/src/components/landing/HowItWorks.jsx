import React from "react"

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-white/5 bg-[#121212]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wider text-[#f6b100]">Three Simple Steps</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Launch in under 15 minutes
          </p>
          <p className="mt-4 text-base text-gray-400">
            No bulky proprietary terminal blocks or complicated networks required. Run on any modern tablet, iPad, or computer screen.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#181818]/40 rounded-xl border border-white/5 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f6b100] text-black font-black text-lg mb-5 shadow-lg shadow-[#f6b100]/20">
              01
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Create Your Menu</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Add your dishes, categorize items (apps, mains, drinks), configure prices, and easily note custom prep instructions.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#181818]/40 rounded-xl border border-white/5 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f6b100] text-black font-black text-lg mb-5 shadow-lg shadow-[#f6b100]/20">
              02
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Configure Tables</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Create a quick layout representation of your restaurant tables so servers can visually input and manage specific tables.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-[#181818]/40 rounded-xl border border-white/5 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f6b100] text-black font-black text-lg mb-5 shadow-lg shadow-[#f6b100]/20">
              03
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Go Live & Take Orders</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fire orders, update kitchen queues, handle payments, check dashboards, and track restaurant analytics in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
