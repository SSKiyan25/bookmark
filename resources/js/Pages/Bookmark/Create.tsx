import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Category } from "@/types";
import { Head } from "@inertiajs/react";
import { useBookmarkValidation, BookmarkFormData } from "@/hooks";
import BookmarkForm from "@/Components/Form/Bookmark";
import FormLayout from "@/Layouts/Form";

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

    const handleArchivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData("is_archived", e.target.checked);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Run client-side validation before submitting
        if (validateAll()) {
            post(route("bookmarks.store"), {
                onSuccess: () => reset(), // Clear form on success
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Add Bookmark
                </h2>
            }
        >
            <Head title="Add Bookmark" />

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
                    submitButtonText="Add Bookmark"
                    isEdit={false}
                />
            </FormLayout>
        </AuthenticatedLayout>
    );
}
