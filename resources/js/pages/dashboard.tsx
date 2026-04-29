import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-950">
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        Log Out
                    </Link>
                </div>
                
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-white/10">
                    <p className="text-gray-600 dark:text-gray-300">
                        You're logged in! Welcome to the Student Result Management System.
                    </p>
                </div>
            </div>
        </div>
    );
}
