import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Bookmark, Category, PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import Checkbox from "@/Components/Checkbox";
import { useBookmarkValidation, BookmarkFormData } from "@/hooks";
import SelectInput from "@/Components/SelectInput";

interface BookmarkEditProps extends PageProps {
    bookmark: Bookmark;
    categories: Category[];
}

export default function Edit({ bookmark, categories }: BookmarkEditProps) {
    const bookmarkData =
        "data" in bookmark && bookmark.data ? bookmark.data : bookmark;
    const bookmarkId = bookmarkData.id;

    // Initialize form with bookmark data
    const { data, setData, patch, processing, errors } =
        useForm<BookmarkFormData>({
            title: bookmarkData.title || "",
            url: bookmarkData.url || "",
            description: bookmarkData.description || "",
            category_id: bookmarkData.category_id?.toString() || "",
            is_archived: bookmarkData.is_archived || false,
        });

    // Set up validation
    const {
        validationErrors,
        isFormValid,
        validateTitle,
        validateUrl,
        validateDescription,
        validateCategory,
        validateAll,
    } = useBookmarkValidation(data, categories);

    // Run initial validation on mount
    useEffect(() => {
        if (data.title) validateTitle(data.title);
        if (data.url) validateUrl(data.url);
        if (data.description) validateDescription(data.description);
        if (data.category_id) validateCategory(data.category_id);
    }, []);

    // Form field handlers
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

    const handleArchivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData("is_archived", e.target.checked);
    };

    // Form submission handler
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!validateAll()) {
            return;
        }

        if (!bookmarkId) {
            console.error("Bookmark ID is missing");
            return;
        }

        patch(route("bookmarks.update", bookmarkId), {
            onSuccess: () => {
                //
            },
            onError: (errors) => {
                console.error("Update failed:", errors);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Edit Bookmark
                </h2>
            }
        >
            <Head title="Edit Bookmark" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-card shadow-sm sm:rounded-lg border border-border">
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
                                        maxLength={255}
                                    />
                                    <InputError
                                        message={
                                            errors.title ||
                                            validationErrors.title
                                        }
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        A descriptive title for your bookmark.
                                    </p>
                                </div>

                                {/* URL Field */}
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
                                    />
                                    <InputError
                                        message={
                                            errors.url || validationErrors.url
                                        }
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        The full URL of the website (including
                                        https://).
                                    </p>
                                </div>

                                {/* Description Field */}
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
                                        rows={3}
                                        maxLength={1000}
                                    />
                                    <InputError
                                        message={
                                            errors.description ||
                                            validationErrors.description
                                        }
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        A brief description of the website (max
                                        1000 characters).
                                    </p>
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <InputLabel
                                        htmlFor="category_id"
                                        value="Category"
                                    />
                                    <SelectInput
                                        id="category_id"
                                        name="category_id"
                                        value={data.category_id}
                                        className="mt-1 block w-full"
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
                                    </SelectInput>
                                    <InputError
                                        message={
                                            errors.category_id ||
                                            validationErrors.category_id
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Archive Checkbox */}
                                <div className="block">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="is_archived"
                                            checked={data.is_archived}
                                            onChange={handleArchivedChange}
                                        />
                                        <span className="ml-2 text-sm text-muted-foreground">
                                            Archive this bookmark
                                        </span>
                                    </label>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Archived bookmarks are hidden from your
                                        main view.
                                    </p>
                                    <InputError
                                        message={errors.is_archived}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-between gap-4">
                                    <Link
                                        href={route("dashboard")}
                                        className="rounded-md px-4 py-2 text-muted-foreground underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        Back to Dashboard
                                    </Link>

                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={route("dashboard")}
                                            className="rounded-md px-4 py-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                            Cancel
                                        </Link>
                                        <PrimaryButton
                                            className="ml-4"
                                            disabled={
                                                processing || !isFormValid
                                            }
                                        >
                                            Update Bookmark
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
