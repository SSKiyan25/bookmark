import { forwardRef, SelectHTMLAttributes } from "react";

export default forwardRef<
    HTMLSelectElement,
    SelectHTMLAttributes<HTMLSelectElement>
>(function SelectInput({ className = "", children, ...props }, ref) {
    return (
        <select
            {...props}
            ref={ref}
            className={
                "rounded-md border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 " +
                className
            }
        >
            {children}
        </select>
    );
});
