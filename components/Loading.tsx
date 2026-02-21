import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full space-y-12 animate-in fade-in duration-1000 overflow-hidden">
            {/* Cinematic Pulsing Core */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Outer Glows */}
                <div className="absolute inset-0 bg-white/3 rounded-full animate-ping duration-4000"></div>
                <div className="absolute inset-4 bg-white/5 rounded-full animate-ping duration-3000 delay-500"></div>
                
                {/* Orbiting Rings */}
                <div className="absolute inset-2 border border-white/20 rounded-full animate-spin duration-3000"></div>
                <div className="absolute inset-6 border border-white/10 rounded-full animate-reverse-spin duration-2000"></div>
                
                {/* Core Essence */}
                <div className="relative">
                    <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,1)]"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping duration-1000 opacity-50"></div>
                </div>
            </div>

            <div className="text-center space-y-4">
                <div className="flex flex-col items-center">
                    <p className="font-cinzel text-[10px] tracking-[0.8em] text-white opacity-40 animate-pulse uppercase">
                        Summoning Essence
                    </p>
                    <div className="mt-4 flex gap-1">
                        {[0, 1, 2].map(i => (
                            <div 
                                key={i}
                                className="w-1 h-1 bg-white/20 rounded-full animate-bounce" 
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes reverse-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                .animate-reverse-spin {
                    animation: reverse-spin 2s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Loading;
