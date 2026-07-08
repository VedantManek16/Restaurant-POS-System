import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel"

const getGradientClass = (initials) => {
  switch (initials) {
    case "MW":
      return "bg-gradient-to-tr from-[#f6b100] to-[#ff6b00]"
    case "SD":
      return "bg-gradient-to-tr from-[#6366f1] to-[#a855f7]"
    case "JK":
      return "bg-gradient-to-tr from-[#10b981] to-[#06b6d4]"
    case "RL":
      return "bg-gradient-to-tr from-[#f43f5e] to-[#fda4af]"
    case "AB":
      return "bg-gradient-to-tr from-[#3b82f6] to-[#14b8a6]"
    default:
      return "bg-gray-600"
  }
}

const Testimonials = () => {
  const testimonials = [
    {
      initials: "MW",
      name: "Marcus Wong",
      role: "Owner, The Golden Dumpling",
      text: "Restro POS cut our bill-punching times in half. It is so easy that even our new part-time servers learned how to use it in under ten minutes. Absolutely zero downtime during peak Friday nights."
    },
    {
      initials: "SD",
      name: "Sarah Davis",
      role: "Manager, Sunset Bistro & Bar",
      text: "We love the visual table configuration feature. Seeing which tables have been waiting too long for billing keeps our hostess staff on track. It helped us turn tables 15 minutes faster."
    },
    {
      initials: "JK",
      name: "John Kowalski",
      role: "Founder, Dough & Co. Pizzeria",
      text: "Not having a transaction fee cut is a lifesaver. Other systems wanted a cut of every payment, but Restro's flat subscription has saved us over $600 a month in card fees alone."
    },
    {
      initials: "RL",
      name: "Rebecca Lim",
      role: "Founder, Brew & Bite Cafe",
      text: "Adding items to the menu or modifying categories is instantaneous. Our kitchen screens get updated in real-time, completely ending errors with kitchen orders."
    },
    {
      initials: "AB",
      name: "Ahmed Bilal",
      role: "Owner, Spice Route Kitchen",
      text: "The sales analytics page has given us amazing insights. We removed 3 underperforming dishes and increased our overall net profit by 8% in just our first month."
    }
  ]

  return (
    <section id="testimonials" className="py-20 md:py-28 border-t border-white/5 bg-[#121212]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wider text-[#f6b100]">Owner Endorsements</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Loved by local food joints
          </p>
          <p className="mt-4 text-base text-gray-400">
            Read how fellow restaurant owners turned operational chaos into structured, reliable growth.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full relative"
          >
            <CarouselContent>
              {testimonials.map((item, idx) => (
                <CarouselItem key={idx} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="bg-[#181818]/60 border-white/5 p-6 flex flex-col justify-between h-full min-h-[220px]">
                    <CardContent className="p-0 text-sm text-gray-300 leading-relaxed italic">
                      "{item.text}"
                    </CardContent>
                    <div className="flex items-center gap-3 mt-6 border-t border-white/5 pt-4">
                      <div className={`w-9 h-9 rounded-full ${getGradientClass(item.initials)} flex items-center justify-center font-bold text-xs text-white`}>
                        {item.initials}
                      </div>
                      <div>
                        <h6 className="text-xs font-semibold text-white">{item.name}</h6>
                        <p className="text-[10px] text-gray-500">{item.role}</p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Bottom centered slider controls for clean look & mobile safety */}
            <div className="flex justify-center gap-3 mt-8">
              <CarouselPrevious
                variant="ghost"
                size="icon"
                className="static translate-y-0 bg-[#1c1c1c] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 flex items-center justify-center transition-colors cursor-pointer"
              />
              <CarouselNext
                variant="ghost"
                size="icon"
                className="static translate-y-0 bg-[#1c1c1c] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 flex items-center justify-center transition-colors cursor-pointer"
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
