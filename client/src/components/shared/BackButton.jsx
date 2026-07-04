import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button 
            onClick={() => navigate(-1)} 
            className='bg-[#1a1a1a] hover:bg-[#262626] border border-[#2d2d2d]/60 text-[#f5f5f5] p-2 rounded-full transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-sm'
        >
            <IoArrowBackOutline size={16} />
        </button>
    )
}

export default BackButton