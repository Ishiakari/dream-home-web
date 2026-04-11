'use client';

import { useEffect, useState } from "react"; // 🌟 Added useState
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileRolePanels from "@/components/profile/ProfileRolePanels";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm"; // 🌟 Import your new form
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    
    // 🌟 THE TOGGLE: This controls whether we see the dashboard or the edit form
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login?next=/profile");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <section className="min-h-[calc(100vh-140px)] bg-linear-to-b from-[#f4f8ff] to-white px-4 py-8 sm:px-6 sm:py-10">
                <div className="mx-auto max-w-5xl animate-pulse space-y-5">
                    <div className="h-44 rounded-2xl bg-blue-100/60" />
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="h-56 rounded-2xl bg-blue-100/60" />
                        <div className="h-56 rounded-2xl bg-blue-100/60" />
                    </div>
                </div>
            </section>
        );
    }

    if (!isAuthenticated) {
        return (
            <section className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-linear-to-b from-[#f4f8ff] to-white px-4 py-8">
                <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-[#003580]">Redirecting to sign in...</h1>
                    <p className="mt-2 text-sm text-gray-600">You need to be logged in to access your profile.</p>
                    <Link
                        href="/login?next=/profile"
                        className="mt-4 inline-flex items-center rounded-lg bg-[#003580] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#002a66]"
                    >
                        Sign in now
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-[calc(100vh-140px)] bg-linear-to-b from-[#f4f8ff] to-white px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
                
                {/* 🌟 LOGIC: If isEditing is true, show the Form. Otherwise, show the Dashboard. */}
                {isEditing ? (
                    <ProfileSettingsForm 
                        user={user} 
                        onCancel={() => setIsEditing(false)} 
                    />
                ) : (
                    <>
                        <ProfileSummaryCard 
                            user={user} 
                            onEditClick={() => setIsEditing(true)} 
                        />
                        <ProfileRolePanels user={user} />
                    </>
                )}
                
            </div>
        </section>
    );
}