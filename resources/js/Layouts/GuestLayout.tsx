import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { Toaster } from "@/Components/ui/sonner";
import { ModeToggle } from "@/Components/mode-toggle";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-background pt-6 sm:justify-center sm:pt-0">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            <div>
                <Link href="/">
                    <ApplicationLogo
                        useImage={true}
                        logoVariant="2"
                        className="h-12 w-12"
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-card px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg border border-border">
                {children}
                <Toaster />
            </div>
        </div>
    );
}
