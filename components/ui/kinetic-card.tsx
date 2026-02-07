'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { MouseEvent, ReactNode } from 'react';

interface KineticCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    gradientColor?: string;
}

export const KineticCard = ({ children, className = '', onClick, gradientColor = 'from-blue-500/20 to-purple-500/20' }: KineticCardProps) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const maskImage = useMotionTemplate`radial-gradient(300px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <div
            onMouseMove={handleMouseMove}
            onClick={onClick}
            className={`relative group rounded-3xl border border-white/10 bg-zinc-900/50 overflow-hidden ${className} cursor-pointer hover:scale-[1.01] transition-transform duration-500`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Spotlight effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-30"
                style={style}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>

            <div className="relative z-20 h-full">{children}</div>
        </div>
    );
};
