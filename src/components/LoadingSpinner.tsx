import React from "react";
import Image from "next/image";

export default function LoadingSpinner() {
    return (
        <main className="flex justify-center items-center min-h-screen bg-dark text-white">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin-slow">
            <Image
                src="/icons/knife.svg"
                alt="Chargement"
                width={64}
                height={64}
            />
            </div>
            <p className="text-lg mt-6">Chargement...</p>
        </div>
        </main>
    );
}
