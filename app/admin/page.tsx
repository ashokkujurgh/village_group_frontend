"use client";

import { Suspense } from "react";
import Header from "../component/header";
import AdminContent from "./AdminContent";

function AdminLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </main>
        </div>
    );
}

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Suspense fallback={<AdminLoading />}>
                <AdminContent />
            </Suspense>
        </div>
    );
}