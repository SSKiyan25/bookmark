import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Bookmark, Category, PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { useBookmarkValidation, BookmarkFormData } from "@/hooks";
import BookmarkForm from "@/Components/Form/Bookmark";
import FormLayout from "@/Layouts/Form";

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
                // Optional: Add success notification or redirect
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

            <FormLayout>
                <BookmarkForm
                    data={data}
                    onSubmit={submit}
                    onTitleChange={handleTitleChange}
                    onUrlChange={handleUrlChange}
                    onDescriptionChange={handleDescriptionChange}
                    onCategoryChange={handleCategoryChange}
                    onArchivedChange={handleArchivedChange}
                    categories={categories}
                    errors={errors}
                    validationErrors={validationErrors}
                    processing={processing}
                    isFormValid={isFormValid}
                    submitButtonText="Update Bookmark"
                    isEdit={true}
                />
            </FormLayout>
        </AuthenticatedLayout>
    );
}
