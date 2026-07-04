import Greetings from "../components/home/Greetings"
import BottomNav from "../components/shared/BottomNav"
import MiniCard from "../components/home/MiniCard"
import RecentOrders from "../components/home/RecentOrders"
import PopularDishes from "../components/home/PopularDishes"
import { BsCashCoin } from "react-icons/bs"
import { GrInProgress } from 'react-icons/gr'

const Home = () => {
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-4.5rem)] overflow-hidden flex gap-3 pb-16">
      {/* Left Div */}
      <div className="flex-[3] flex flex-col min-w-0 overflow-hidden">
        <Greetings />
        <div className="flex items-center w-full gap-4 px-8 mt-5">
          <MiniCard title="Total Earnings" icon={<BsCashCoin />} number={512} footerNum={1.6} />
          <MiniCard title="In Progress" icon={< GrInProgress />} number={16} footerNum={3.6} />
        </div>
        <RecentOrders />
      </div>

      {/* Right Div */}
      <div className="flex-[2] min-w-0 overflow-hidden border-l border-[#2d2d2d]/30 flex flex-col">
        <PopularDishes />
      </div>
      <BottomNav />
    </section>
  )
}

export default Home
