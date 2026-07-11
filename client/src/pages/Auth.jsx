import React, { useEffect, useState } from "react";
import restaurant from "../assets/restaurant-img.jpg";
import logo from "../assets/logo.png";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {
    useEffect(() => {
        document.title = "POS | Auth";
    }, []);

    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#121212] overflow-hidden">
            {/* Left Section - Hero/Branding */}
            <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center bg-cover overflow-hidden">
                {/* BG Image */}
                <img 
                    className="w-full h-full object-cover" 
                    src={restaurant} 
                    alt="Restaurant Image" 
                />

                {/* Rich Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/90 to-transparent opacity-90"></div>

                {/* Subtle light flares/accents */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl"></div>

                {/* Top Brand Logo inside Hero */}
                <div className="absolute top-10 left-10 flex items-center gap-3">
                    <img src={logo} alt="Restro Logo" className="h-9 w-9 object-contain" />
                    <span className="text-xl font-bold tracking-wide text-white font-sans">
                        RestroDesk<span className="text-yellow-400">.</span>
                    </span>
                </div>

                {/* Premium Product Messaging Card at bottom */}
                <div className="absolute bottom-16 left-12 right-12 p-8 rounded-2xl bg-black/50 backdrop-blur-md border border-white/5 shadow-2xl">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight mb-3">
                        Next-Gen POS & Restaurant SaaS
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        RestroDesk empowers multi-outlet restaurant chains with high-speed table rotations, direct-to-kitchen ticketing, dynamic billing pipelines, and granular cloud access control.
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-white/10 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            Multi-Outlet SaaS
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            Kitchen KDS Sync
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            Live Table Layouts
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            Granular Staff Roles
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Form Panel */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center bg-[#161616] px-6 py-6 md:px-12 relative overflow-y-auto scrollbar-hide">
                {/* Background decorative blob */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="w-full max-w-[380px] bg-[#1e1e1e] p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10">
                    <div className="flex flex-col items-center gap-2 mb-5">
                        <div className="p-1.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 shadow-inner">
                            <img src={logo} alt="Restro Logo" className="h-10 w-10 object-contain" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-wide">RestroDesk</h1>
                        <p className="text-[10px] text-gray-400 text-center">Modern Restaurant Point of Sale System</p>
                    </div>

                    <h2 className="text-2xl text-center font-bold text-white tracking-tight mb-5">
                        {isRegister ? "Create Account" : "Welcome Back"}
                    </h2>

                    {/* Components */}
                    <div>
                        {isRegister ? (
                            <Register setIsRegister={setIsRegister} />
                        ) : (
                            <Login />
                        )}
                    </div>

                    <div className="flex justify-center mt-6 pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-400">
                            {isRegister ? "Already have an account?" : "Don't have an employee account?"}{" "}
                            <button 
                                onClick={() => setIsRegister(!isRegister)} 
                                className="text-yellow-400 font-semibold hover:text-yellow-300 focus:outline-none transition-colors cursor-pointer"
                            >
                                {isRegister ? "Sign In" : "Sign Up"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;