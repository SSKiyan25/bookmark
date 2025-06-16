import { ReactNode } from "react";

interface FormLayoutProps {
    children: ReactNode;
    maxWidth?: string;
}

export default function FormLayout({
    children,
    maxWidth = "max-w-2xl",
}: FormLayoutProps) {
    return (
        <div className="py-12">
            <div className={`mx-auto ${maxWidth} sm:px-6 lg:px-8`}>
                <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg border border-border">
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
