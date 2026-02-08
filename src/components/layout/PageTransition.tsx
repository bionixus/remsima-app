"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const variants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1] as any, // McKinsey-style: smooth, elegant easing
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.3,
            ease: [0.5, 0, 0.75, 0] as any,
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
