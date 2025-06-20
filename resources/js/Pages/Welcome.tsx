import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ReactNode } from "react";
import { ModeToggle } from "@/Components/mode-toggle";

// Define a type for our feature data
interface Feature {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function Welcome({ auth }: PageProps) {
    const features: Feature[] = [
        {
            icon: (
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
            ),
            title: "Categorize Bookmarks",
            description:
                "Create categories to organize your bookmarks efficiently",
        },
        {
            icon: (
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
            ),
            title: "Easy to Add",
            description:
                "Quickly add and save bookmarks with title, URL, and description",
        },
        {
            icon: (
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
            ),
            title: "Archive Option",
            description:
                "Archive bookmarks instead of deleting them completely",
        },
        {
            icon: (
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
            ),
            title: "Secure Access",
            description:
                "Your bookmarks are private and only accessible with your account",
        },
    ];

    return (
        <>
            <Head title="BookChest - Simple Bookmark Manager" />
            <div className="min-h-screen bg-gradient-to-br from-background/50 to-primary/5">
                <div className="relative flex min-h-screen flex-col items-center">
                    {/* Header/Navigation */}
                    <header className="w-full bg-card/80 backdrop-blur-sm shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <svg
                                    className="h-8 w-8 text-primary"
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
                                <span className="ml-2 text-xl font-bold text-foreground">
                                    BookChest
                                </span>
                            </div>
                            <nav className="flex space-x-4">
                                <ModeToggle />
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={route("dashboard")}>
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outline" asChild>
                                            <Link href={route("login")}>
                                                Log in
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={route("register")}>
                                                Register
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </nav>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <main className="flex-grow flex items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
                                Simple Bookmark Management with
                                <span className="text-primary"> BookChest</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Save and organize your favorite websites with
                                categories. Access your bookmarks anywhere,
                                anytime.
                            </p>

                            {auth.user ? (
                                <Button size="lg" asChild>
                                    <Link
                                        href={route("dashboard")}
                                        className="inline-flex items-center"
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
                                </Button>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" asChild>
                                        <Link
                                            href={route("register")}
                                            className="inline-flex items-center"
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
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href={route("login")}>
                                            Sign In
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Features Section */}
                    <section className="w-full bg-card py-12">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-center text-foreground mb-8">
                                Core Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {features.map((feature, index) => (
                                    <Card key={index} className="bg-card">
                                        <CardContent className="p-5 flex">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4 flex-shrink-0">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-medium text-foreground">
                                                    {feature.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {feature.description}
                                                </CardDescription>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    <footer className="w-full bg-muted/50 py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
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
