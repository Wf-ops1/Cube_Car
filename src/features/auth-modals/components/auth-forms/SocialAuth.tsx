import React from 'react';

const SocialAuth: React.FC = () => {
    return (
        <>
            <div className="flex justify-center gap-4 sm:gap-6 mb-6">
                <button className="w-14 h-14 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex items-center justify-center hover:scale-105 transition-transform hover:shadow-glass backdrop-blur-sm">
                    <i className="fab fa-facebook-f text-[#1877F2] text-xl"></i>
                </button>
                <button className="w-14 h-14 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex items-center justify-center hover:scale-105 transition-transform hover:shadow-glass backdrop-blur-sm">
                    <i className="fab fa-apple text-slate-900 text-xl"></i>
                </button>
                <button className="w-14 h-14 rounded-2xl border border-white/60 bg-white/50 shadow-sm flex items-center justify-center hover:scale-105 transition-transform hover:shadow-glass backdrop-blur-sm">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-6 h-6" />
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-slate-400 font-bold text-xs uppercase bg-transparent">ou</span>
                </div>
            </div>
        </>
    );
};

export default SocialAuth;
