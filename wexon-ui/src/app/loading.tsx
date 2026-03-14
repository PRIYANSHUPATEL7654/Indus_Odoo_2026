"use client";

import WexonWordmark from "@/components/branding/WexonWordmark";

const GlobalLoading = () => {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">

                <div className="rounded-full border bg-white px-6 py-5 shadow-sm animate-pulse">
                    <WexonWordmark size="sm" />
                </div>

                <p className="text-sm font-medium text-gray-700 animate-pulse">
                    Loading...
                </p>

            </div>
        </div>
    );
};

export default GlobalLoading;
