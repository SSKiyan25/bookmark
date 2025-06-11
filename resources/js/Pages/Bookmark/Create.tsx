import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Category } from "@/types";
import { Head, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import Checkbox from "@/Components/Checkbox";
import { useBookmarkValidation, BookmarkFormData } from "@/hooks";

interface CreateBookmarkProps extends PageProps {
    categories: Category[];
}

export default function Create({ categories }: CreateBookmarkProps) {
    const { data, setData, post, processing, errors, reset } =
        useForm<BookmarkFormData>({
            title: "",
            url: "",
            description: "",
            category_id: "",
            is_archived: false,
        });

    // Use our custom validation hook
    const {
        validationErrors,
        isFormValid,
        validateTitle,
        validateUrl,
        validateDescription,
        validateCategory,
        validateAll,
    } = useBookmarkValidation(data, categories);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setData("title", title);
        validateTitle(title);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setData("url", url);
        validateUrl(url);
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const description = e.target.value;
        setData("description", description);
        validateDescription(description);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        setData("category_id", categoryId);
        validateCategory(categoryId);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (validateAll()) {
            post(route("bookmarks.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Bookmark
                </h2>
            }
        >
            <Head title="Add Bookmark" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Title Field */}
                                <div>
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        isFocused={true}
                                        onChange={handleTitleChange}
                                        required
                                        minLength={2}
                                        maxLength={255}
                                    />
                                    <InputError
                                        message={
                                            errors.title ||
                                            validationErrors.title
                                        }
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        The name or short description of the
                                        website (max 255 characters).
                                    </p>
                                </div>

                                {/* URL Field with Enhanced Validation */}
                                <div>
                                    <InputLabel htmlFor="url" value="URL" />
                                    <TextInput
                                        id="url"
                                        type="url"
                                        name="url"
                                        value={data.url}
                                        className="mt-1 block w-full"
                                        onChange={handleUrlChange}
                                        required
                                        placeholder="https://example.com"
                                    />
                                    <InputError
                                        message={
                                            errors.url || validationErrors.url
                                        }
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Only HTTP and HTTPS URLs are allowed for
                                        security reasons.
                                    </p>
                                </div>

                                {/* Description Field with Injection Protection */}
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
                                        Brief description of the bookmark. HTML
                                        tags and scripts are not allowed. (max
                                        1000 characters)
                                    </p>
                                </div>

                                {/* Category Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="category_id"
                                        value="Category"
                                    />
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={data.category_id}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={handleCategoryChange}
                                        required
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={
                                            errors.category_id ||
                                            validationErrors.category_id
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Is Archived Field */}
                                <div className="block">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="is_archived"
                                            checked={data.is_archived}
                                            onChange={(e) =>
                                                setData(
                                                    "is_archived",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Archive this bookmark
                                        </span>
                                    </label>
                                    <InputError
                                        message={errors.is_archived}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Form Actions */}
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
                                        Add Bookmark
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
