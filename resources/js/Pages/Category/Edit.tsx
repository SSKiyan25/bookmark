import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Category, PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { useCategoryValidation, CategoryFormData } from "@/hooks";
import CategoryForm from "@/Components/Form/Category";
import FormLayout from "@/Layouts/Form";
import { toast } from "sonner";

interface CategoryEditProps extends PageProps {
    category: Category;
}

export default function Edit({ category }: CategoryEditProps) {
    // Handle different category data structures (wrapped vs unwrapped)
    const categoryData =
        "data" in category && category.data ? category.data : category;
    const categoryId = categoryData.id;

    const { data, setData, patch, processing, errors } =
        useForm<CategoryFormData>({
            name: categoryData.name || "",
            description: categoryData.description || "",
        });

    const {
        validationErrors,
        isFormValid,
        validateName,
        validateDescription,
        validateAll,
    } = useCategoryValidation(data);

    useEffect(() => {
        if (data.name) validateName(data.name);
        if (data.description) validateDescription(data.description);
    }, []);

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

        // Run client-side validation before submitting
        if (validateAll()) {
            patch(route("categories.update", categoryId), {
                onSuccess: () => {
                    toast.success("Category updated successfully!");
                },
                onError: (errors) => {
                    console.error("Update failed:", errors);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Edit Category
                </h2>
            }
        >
            <Head title="Edit Category" />

            <FormLayout>
                <CategoryForm
                    data={data}
                    onSubmit={submit}
                    onNameChange={handleNameChange}
                    onDescriptionChange={handleDescriptionChange}
                    errors={errors}
                    validationErrors={validationErrors}
                    processing={processing}
                    isFormValid={isFormValid}
                    submitButtonText="Update Category"
                    isEdit={true}
                />
            </FormLayout>
        </AuthenticatedLayout>
    );
}
