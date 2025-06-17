import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { Toaster } from "@/Components/ui/sonner";
import { ModeToggle } from "@/Components/mode-toggle";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col justify-center items-center bg-background px-4 sm:px-6 lg:px-8">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link href="/">
                        <ApplicationLogo
                            useImage={true}
                            logoVariant="2"
                            className="h-12 w-12"
                        />
                    </Link>
                </div>

                <div className="w-full overflow-hidden bg-card px-6 py-4 shadow-md rounded-lg border border-border">
                    {children}
                    <Toaster />
                </div>
            </div>
        </div>
    );
}
