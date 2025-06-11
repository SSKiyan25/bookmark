import { Link } from "@inertiajs/react";

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    // This shold not render pagination if there's only 3 or fewer links (prev, next, current)
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-6 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
                {/* Mobile previous button */}
                {links[0].url ? (
                    <Link
                        href={links[0].url as string}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                ) : (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-100">
                        Previous
                    </span>
                )}

                {/* Mobile next button */}
                {links[links.length - 1].url ? (
                    <Link
                        href={links[links.length - 1].url as string}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </Link>
                ) : (
                    <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-300 bg-gray-100">
                        Next
                    </span>
                )}
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                <div>
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        {links.map((link, i) => {
                            // If the URL is null, render a non-clickable span
                            if (!link.url) {
                                return (
                                    <span
                                        key={i}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            }

                            // If we have a valid URL, render a Link
                            return (
                                <Link
                                    key={i}
                                    href={link.url as string} // Type assertion here too
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        link.active
                                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
