import MenuContainer from "@/components/menu/MenuContainer"
import BackButton from "@/components/shared/BackButton"
import BottomNav from "@/components/shared/BottomNav"
import { MdRestaurantMenu } from "react-icons/md"
const Menu = () => {
    return (
        <section className="bg-[#1f1f1f] h-[calc(100vh-4.5rem)] overflow-hidden flex gap-3 pb-16">
            {/* Left Div */}
            <div className="flex-3">
                <div className="flex items-center justify-between px-10 py-3 shrink-0">
                    <div className="flex items-center gap-4">
                        <BackButton />
                        <h1 className="text-[#f5f5f5] text-xl font-bold tracking-wide">Menu</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
                            <MdRestaurantMenu className="text-[#f5f5f5] text-3xl" />
                            <div className="flex flex-col items-start leading-tight">
                                <h1 className="text-xs text-[#f5f5f5] font-semibold">Customer Name</h1>
                                <p className="text-[10px] text-[#ababab] font-medium">Table No: 2</p>
                            </div>
                        </div>
                    </div>
                </div>
                <MenuContainer />
            </div>

            {/* Right Div */}
            <div className="flex-1 min-w-0 overflow-hidden border-l border-[#2d2d2d]/30 flex flex-col">

            </div>
            <BottomNav />
        </section>
    )
}
export default Menu