'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ContactSection from '@/components/ui/ContactSection';
import BranchesSection from '@/components/ui/BranchesSection';
import { apiClient } from '@/lib/apiClient';

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

    /**
     * Normalize the backend Branch model fields into the shape BranchesSection expects.
     * Backend: { branch_no, street, area, city, postcode, telephone_no, fax_no, ... }
     * Component: { id, name, address, phone, email }
     */
    function toBranchCardData(branch) {
        const name = branch.area
            ? `${branch.area} Branch`
            : `${branch.city} Branch`;
        const address = [branch.street, branch.area, branch.city, branch.postcode]
            .filter(Boolean)
            .join(', ');

        return {
            id: branch.branch_no,
            name,
            address,
            phone: branch.telephone_no || '—',
            email: branch.fax_no ? `Fax: ${branch.fax_no}` : '—',
        };
    }

    export default function AboutPage() {
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBranches() {
            try {
                const data = await apiClient.get('branches/');
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.results)
                    ? data.results
                    : [];
                setBranches(list.map(toBranchCardData));
            } catch (err) {
                console.error('Failed to fetch branches:', err);
                setBranches([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBranches();
    }, []);

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
            {isLoading ? (
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 md:p-12 animate-pulse space-y-4">
                    <div className="h-8 w-48 rounded bg-slate-200 mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-72 rounded-2xl bg-slate-100" />
                        ))}
                    </div>
                </div>
            ) : branches.length === 0 ? (
                <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 md:p-12 text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Our Branches</h2>
                    <p className="mt-3 text-sm text-slate-500">No branch data available at the moment.</p>
                </div>
            ) : (
                <BranchesSection data={branches} />
            )}
            </motion.div>
        </motion.div>
        </main>
    );
}