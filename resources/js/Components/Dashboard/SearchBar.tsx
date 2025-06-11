import React from "react";

interface SearchBarProps {
    searchQuery: string | null;
    onSearchQueryChange: (query: string) => void;
    onSearch: (e: React.FormEvent) => void;
    placeholder?: string;
    label?: string;
}

export default function SearchBar({
    searchQuery,
    onSearchQueryChange,
    onSearch,
    placeholder = "Search...",
    label = "Search",
}: SearchBarProps) {
    return (
        <div className="flex-grow">
            <form onSubmit={onSearch}>
                {label && (
                    <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery || ""}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder={placeholder}
                    />
                    <button
                        type="submit"
                        className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}
