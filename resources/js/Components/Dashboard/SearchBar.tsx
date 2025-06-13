import React, { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";

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
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(true);

    // Validate search query when it changes
    useEffect(() => {
        validateSearchQuery(searchQuery || "");
    }, [searchQuery]);

    // Function to validate the search query
    const validateSearchQuery = (query: string): boolean => {
        // Empty queries are valid
        if (!query.trim()) {
            setError(null);
            setIsValid(true);
            return true;
        }

        // Check for excessive length
        if (query.length > 100) {
            setError("Search query is too long (max 100 characters)");
            setIsValid(false);
            return false;
        }

        // Check for potentially malicious patterns
        const suspiciousPattern =
            /<script|javascript:|onerror=|onclick=|onload=|\(\)|eval\(|alert\(|document\.|window\.|setTimeout\(|setInterval\(/i;
        if (suspiciousPattern.test(query)) {
            setError("Search query contains potentially unsafe content");
            setIsValid(false);
            return false;
        }

        // Check for SQL injection patterns
        const sqlInjectionPattern =
            /(\b(select|insert|update|delete|drop|alter|create|union)\b.*\b(from|into|where|table|database)\b)|(-{2}|\/\*|\*\/|;)/i;
        if (sqlInjectionPattern.test(query)) {
            setError("Search query contains invalid characters");
            setIsValid(false);
            return false;
        }

        // Clear error if valid
        setError(null);
        setIsValid(true);
        return true;
    };

    // Handle form submission with validation
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateSearchQuery(searchQuery || "")) {
            toast.error(error || "Invalid search query");
            return;
        }

        onSearch(e);
    };

    return (
        <div className="flex-grow">
            <form onSubmit={handleSubmit}>
                {label && (
                    <label
                        htmlFor="search"
                        className="block text-sm font-medium text-foreground mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="flex rounded-md">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                            type="text"
                            name="search"
                            id="search"
                            value={searchQuery || ""}
                            onChange={(e) =>
                                onSearchQueryChange(e.target.value)
                            }
                            className={`pl-10 pr-4 ${
                                !isValid
                                    ? "border-destructive focus:ring-destructive/50"
                                    : ""
                            }`}
                            placeholder={placeholder}
                            aria-invalid={!isValid}
                            aria-describedby={
                                !isValid ? "search-error" : undefined
                            }
                        />
                        {!isValid && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            </div>
                        )}
                    </div>
                    <Button type="submit" className="ml-2" disabled={!isValid}>
                        Search
                    </Button>
                </div>

                {!isValid && (
                    <p
                        className="mt-1 text-xs text-destructive"
                        id="search-error"
                    >
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
}
