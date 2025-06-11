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
                "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " +
                className
            }
        >
            {children}
        </select>
    );
});
