import { SVGAttributes, ImgHTMLAttributes } from "react";

type LogoProps = SVGAttributes<SVGElement> & {
    useImage?: boolean;
    logoVariant?: "1" | "2";
};

export default function ApplicationLogo({
    useImage = false,
    logoVariant = "1",
    ...props
}: LogoProps) {
    if (useImage) {
        return (
            <img
                src={`/logo-${logoVariant}.png`}
                alt="BookChest Logo"
                {...(props as ImgHTMLAttributes<HTMLImageElement>)}
            />
        );
    }

    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${props.className || ""}`}
        >
            <path
                d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
