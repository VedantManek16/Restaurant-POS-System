const Modal = ({ title, onClose, isOpen, children }) => {
    if (!isOpen) return null;
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-50 transition-all duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#1c1c1c] border border-[#2d2d2d]/60 shadow-2xl w-full max-w-[420px] mx-4 rounded-2xl p-6 relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-base text-[#f5f5f5] font-bold tracking-wide">{title}</h2>
                    <button 
                        className="text-[#ababab] hover:text-[#f5f5f5] transition-colors p-1 rounded-lg hover:bg-[#2d2d2d]/40 cursor-pointer" 
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Content */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;