"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Gentle bloom transition — warmth spreading softly like a smile
const variants = {
    initial: {
        opacity: 0,
        scale: 0.98,
        filter: "blur(4px)",
    },
    enter: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1], // smooth deceleration — feels like a deep breath
        },
    },
    exit: {
        opacity: 0,
        scale: 1.01,
        filter: "blur(2px)",
        transition: {
            duration: 0.25,
            ease: [0.4, 0, 1, 1],
        },
    },
};

export function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={variants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
