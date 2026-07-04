const MiniCard = ({ title, icon, number, footerNum }) => {
    return (
        <div className='bg-[#1a1a1a] p-4.5 rounded-xl w-[50%] border border-[#2d2d2d]/30 flex flex-col justify-between'>
            <div className='flex items-start justify-between'>
                <h1 className='text-[#ababab] text-sm font-medium tracking-wide'>{title}</h1>
                <div className={`${title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"} p-2.5 rounded-xl text-[#f5f5f5] text-xl`}>
                    {icon}
                </div>
            </div>
            <div className="mt-3">
                <p className='text-[#f5f5f5] text-3xl font-semibold tracking-tight'>
                    {title === "Total Earnings" ? `₹${number}` : number}
                </p>
                <p className='text-[#ababab] text-xs mt-1.5 font-medium'>
                    <span className='text-[#02ca3a] font-semibold'>{footerNum}% </span>
                    than yesterday
                </p>
            </div>
        </div>
    )
}

export default MiniCard;