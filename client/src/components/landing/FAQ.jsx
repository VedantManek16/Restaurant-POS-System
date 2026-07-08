import React from "react"
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion"

const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-28 border-t border-white/5 bg-[#141414]">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-base font-semibold uppercase tracking-wider text-[#f6b100]">Answering Questions</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </p>
        </div>

        {/* Accordion List */}
        <div className="bg-[#181818] border border-white/5 rounded-xl px-6 py-4">
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="item-1" className="border-b border-white/5 py-2">
              <AccordionTrigger className="text-white text-sm font-semibold hover:text-[#f6b100] transition-colors py-3">
                Do I need to purchase specific hardware or terminals?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm py-2">
                No! Restro POS is completely cloud-based. You can run it on your existing iPads, Android tablets, desktop computers, or even laptops. As long as you have a web browser and an internet connection, you are ready to go.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-white/5 py-2">
              <AccordionTrigger className="text-white text-sm font-semibold hover:text-[#f6b100] transition-colors py-3">
                Can I export my sales data for accounting?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm py-2">
                Absolutely. Restro POS offers complete sales reports export functions. You can export sales, orders, and bill breakdowns as CSV files, which can then be directly imported into accounting packages like QuickBooks, Xero, or Microsoft Excel.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-white/5 py-2">
              <AccordionTrigger className="text-white text-sm font-semibold hover:text-[#f6b100] transition-colors py-3">
                Is there a limit to how many items can be added to the menu?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm py-2">
                No limits at all. Both the Starter and Pro plan allow you to add an unlimited number of categories, dishes, modifiers, and beverage variations to your menu.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none py-2">
              <AccordionTrigger className="text-white text-sm font-semibold hover:text-[#f6b100] transition-colors py-3">
                Can we cancel our subscription at any point?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm py-2">
                Yes, of course. Restro POS subscriptions are billed on a month-to-month or year-to-year basis. You can cancel your plan directly from your dashboard settings with a single click, and you won't be charged for the next period.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FAQ
