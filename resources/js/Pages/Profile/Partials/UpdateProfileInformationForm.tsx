import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        data,
        setData,
        post,
        errors,
        processing,
        recentlySuccessful,
        reset,
    } = useForm({
        name: user.name,
        username: (user as any).username || "",
        email: user.email,
        avatar: null as File | null,
        _method: "PATCH",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Use POST with _method PATCH for file uploads
        post(route("profile.update"), {
            forceFormData: true,
            onSuccess: (page) => {
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setData("avatar", null);

                // Show success toast without page refresh
                toast.success("Profile updated successfully!");

                // Optional: Update the user data in the page props
                // This requires the server to return updated user data
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (2MB = 2 * 1024 * 1024 bytes)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size must be less than 2MB.");
                return;
            }

            // Validate file type
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
            ];
            if (!allowedTypes.includes(file.type)) {
                toast.error(
                    "Please select a valid image file (JPEG, PNG, JPG, or GIF)"
                );
                return;
            }

            setData("avatar", file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        router.delete(route("profile.avatar.remove"), {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setData("avatar", null);
                toast.success("Avatar removed successfully!");
            },
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Generate initials for fallback avatar
    const getInitials = (name: string) => {
        const nameParts = name.split(" ");
        if (nameParts.length > 1) {
            return (
                nameParts[0][0] + nameParts[nameParts.length - 1][0]
            ).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    // Get current avatar URL (preview, user avatar, or default)
    const getCurrentAvatarUrl = () => {
        if (previewUrl) return previewUrl;
        return (user as any).avatar_url;
    };

    const hasAvatar = () => {
        return previewUrl || (user as any).avatar;
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Update your account's profile information, username, avatar,
                    and email address.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 space-y-6"
                encType="multipart/form-data"
            >
                {/* Avatar Section */}
                <div>
                    <InputLabel value="Profile Avatar" />
                    <div className="mt-2 flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage
                                src={getCurrentAvatarUrl()}
                                className="object-cover"
                                alt={user.name}
                            />
                            <AvatarFallback className="text-lg">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={triggerFileInput}
                                className="flex items-center space-x-2"
                            >
                                <Camera className="h-4 w-4" />
                                <span>Change Avatar</span>
                            </Button>

                            {hasAvatar() && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={removeAvatar}
                                    className="flex items-center space-x-2 text-destructive hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                    <span>Remove Avatar</span>
                                </Button>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG, or GIF. Max 2MB.
                    </p>

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                {/* Name Field */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Username Field */}
                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="Enter a unique username"
                    />

                    <p className="mt-1 text-xs text-muted-foreground">
                        Your username can only contain letters, numbers, and
                        underscores.
                    </p>

                    <InputError className="mt-2" message={errors.username} />
                </div>

                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Email Verification Notice */}
                {mustVerifyEmail &&
                    (user as any).email_verified_at === null && (
                        <div>
                            <p className="mt-2 text-sm text-foreground">
                                Your email address is unverified.
                                <Link
                                    href={route("verification.send")}
                                    method="post"
                                    as="button"
                                    className="rounded-md text-sm text-muted-foreground underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ml-1"
                                >
                                    Click here to re-send the verification
                                    email.
                                </Link>
                            </p>

                            {status === "verification-link-sent" && (
                                <div className="mt-2 text-sm font-medium text-green-600">
                                    A new verification link has been sent to
                                    your email address.
                                </div>
                            )}
                        </div>
                    )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? "Saving..." : "Save"}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-muted-foreground">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
