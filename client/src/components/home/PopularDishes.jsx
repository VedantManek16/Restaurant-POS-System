import React from "react";
import { popularDishes } from "../../constants";

const PopularDishes = () => {
  return (
    <div className="px-8 mt-5 flex-1 min-h-0 flex flex-col pb-4">
      <div className="bg-[#1a1a1a] w-full flex-1 flex flex-col rounded-xl border border-[#2d2d2d]/30 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-[#f5f5f5] text-md font-semibold tracking-wide">
            Popular Dishes
          </h2>
          <a href="" className="text-[#025cca] text-xs font-semibold hover:underline">
            View all
          </a>
        </div>

        <div className="px-6 overflow-y-auto flex-1 scrollbar-hide pb-4">
          {popularDishes.map((dish) => {
            return (
              <div
                key={dish.id}
                className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mb-4"
              >
                <span className="text-[#f5f5f5] font-bold text-lg mr-4">
                  {dish.id < 10 ? `0${dish.id}` : dish.id}
                </span>
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div>
                  <p className="text-[#f5f5f5] font-semibold tracking-wide text-sm">
                    {dish.name}
                  </p>
                  <p className="text-[#ababab] text-xs font-semibold mt-1">
                    <span>Orders: </span>
                    <span className="text-[#f5f5f5]">{dish.numberOfOrders}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;