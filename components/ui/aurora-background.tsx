'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuroraBackgroundProps {
    children: ReactNode;
    className?: string;
}

export const AuroraBackground = ({ children, className = '' }: AuroraBackgroundProps) => {
    return (
        <div className={`relative w-full h-full overflow-hidden bg-zinc-950 text-slate-950 ${className}`}>
            <div className="absolute inset-0 z-0 opacity-50">
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-10 blur-3xl will-change-transform"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen will-change-transform"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, -30, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen will-change-transform"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 40, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[130px] mix-blend-screen will-change-transform"
                />
            </div>
            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
};
