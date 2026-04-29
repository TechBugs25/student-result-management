import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTheme } from '../components/theme-provider';
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { theme, setTheme } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        auth: '',
    });

    // console.log(errors)
    const submit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post('/login', {
            onError: () => {
                // 🔐 clear password on failure
                reset('password');
            },
            onSuccess: () => {
                // optional: reset form
                reset();
            },
        });
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 transition-colors duration-300 dark:bg-gray-950">
                {/* Theme Toggle Button */}
                <div className="absolute top-6 right-6">
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950"
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

                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-gray-100/10">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6" noValidate>
                        {errors.auth && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-500/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-500/30">
                                {errors.auth}
                            </div>
                        )}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-2">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500"
                                    placeholder="password must be at least 6 characters"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:ring-offset-gray-900"
                                />
                                <label htmlFor="remember" className="ml-3 block text-sm leading-6 text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing || !data.email || data.password.length < 6}
                                className="flex w-full justify-center rounded-md bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:outline-gray-100"
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
                            &larr; Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
