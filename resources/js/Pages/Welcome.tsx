import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="BookChest - Simple Bookmark Manager" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950">
                <div className="relative flex min-h-screen flex-col items-center">
                    {/* Header/Navigation */}
                    <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm dark:bg-gray-800/80 dark:backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <svg
                                    className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                    BookChest
                                </span>
                            </div>
                            <nav className="flex space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition dark:bg-transparent dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-950"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <main className="flex-grow flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                                Simple Bookmark Management with
                                <span className="text-indigo-600 dark:text-indigo-400">
                                    {" "}
                                    BookChest
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Save and organize your favorite websites with
                                categories. Access your bookmarks anywhere,
                                anytime.
                            </p>

                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-md inline-flex items-center"
                                >
                                    Go to Dashboard
                                    <svg
                                        className="ml-2 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route("register")}
                                        className="px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-md flex items-center justify-center"
                                    >
                                        Get Started
                                        <svg
                                            className="ml-2 h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Link>
                                    <Link
                                        href={route("login")}
                                        className="px-6 py-3 text-base font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition flex items-center justify-center dark:bg-transparent dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-950"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Features Section - Simplified */}
                    <section className="w-full bg-white dark:bg-gray-800 py-12">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                                Core Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg flex">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 flex-shrink-0">
                                        <svg
                                            className="w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Categorize Bookmarks
                                        </h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                                            Create categories to organize your
                                            bookmarks efficiently
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg flex">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 flex-shrink-0">
                                        <svg
                                            className="w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Easy to Add
                                        </h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                                            Quickly add and save bookmarks with
                                            title, URL, and description
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg flex">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 flex-shrink-0">
                                        <svg
                                            className="w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Archive Option
                                        </h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                                            Archive bookmarks instead of
                                            deleting them completely
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg flex">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 flex-shrink-0">
                                        <svg
                                            className="w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Secure Access
                                        </h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                                            Your bookmarks are private and only
                                            accessible with your account
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer className="w-full bg-gray-50 dark:bg-gray-900 py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                            <p>
                                © {new Date().getFullYear()} BookChest. A simple
                                bookmark manager.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
