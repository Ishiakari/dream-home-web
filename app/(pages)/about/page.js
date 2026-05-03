'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ContactSection from '@/components/ui/ContactSection';
import BranchesSection from '@/components/ui/BranchesSection';
import { dummyBranches } from '@/lib/data/dummyBranches';

const container = {
    hidden: {},
    show: {
        transition: {
        staggerChildren: 0.12,
        },
    },
    };

    const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: 'easeOut' },
    },
    };

    export default function AboutPage() {
    return (
        <main className="bg-[#EEF4FF] min-h-screen font-sans">
        <motion.div
            className="max-w-6xl mx-auto py-16 px-6 space-y-16"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={fadeUp}>
            <ContactSection />
            </motion.div>

            <motion.div variants={fadeUp}>
            <BranchesSection data={dummyBranches} />
            </motion.div>
        </motion.div>
        </main>
    );
}