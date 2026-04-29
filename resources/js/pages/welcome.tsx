import { Head, Link } from '@inertiajs/react';
import { useTheme } from '../components/theme-provider';

export default function Welcome() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">

                {/* Theme Toggle Button */}
                <div className="absolute top-6 right-6">
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'light' ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="w-full max-w-2xl text-center">
                    <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Student Result Management
                    </h1>

                    <p className="mb-8 text-gray-600 dark:text-gray-400">
                        A streamlined platform for managing academic records, processing results, and viewing performance analytics.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/login" className="rounded-md bg-gray-900 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950">
                            Login
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-8 text-sm text-gray-500 dark:text-gray-500">
                    &copy; {new Date().getFullYear()} Student Result Management
                </div>
            </div>
        </>
    );
}
