import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import { useCategoryValidation, CategoryFormData } from "@/hooks";

export default function Create({}: PageProps) {
    const { data, setData, post, processing, errors, reset } =
        useForm<CategoryFormData>({
            name: "",
            description: "",
        });

    // Use our custom validation hook
    const {
        validationErrors,
        isFormValid,
        validateName,
        validateDescription,
        validateAll,
    } = useCategoryValidation(data);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData("name", name);
        validateName(name);
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const description = e.target.value;
        setData("description", description);
        validateDescription(description);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (validateAll()) {
            post(route("categories.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Category
                </h2>
            }
        >
            <Head title="Create Category" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        isFocused={true}
                                        onChange={handleNameChange}
                                        required
                                        minLength={2}
                                        maxLength={255}
                                    />
                                    <InputError
                                        message={
                                            errors.name || validationErrors.name
                                        }
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        A short, descriptive name for your
                                        category (max 255 characters).
                                    </p>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="description"
                                        value="Description (Optional)"
                                    />
                                    <TextArea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full"
                                        onChange={handleDescriptionChange}
                                        rows={4}
                                        maxLength={1000}
                                    />
                                    <InputError
                                        message={
                                            errors.description ||
                                            validationErrors.description
                                        }
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        A brief description of what this
                                        category is for (max 1000 characters).
                                    </p>
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route("dashboard")}
                                        className="rounded-md px-4 py-2 text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton
                                        className="ml-4"
                                        disabled={processing || !isFormValid}
                                    >
                                        Create Category
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
