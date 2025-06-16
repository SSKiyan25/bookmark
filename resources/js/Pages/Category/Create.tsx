import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { useCategoryValidation, CategoryFormData } from "@/hooks";
import CategoryForm from "@/Components/Form/Category";
import FormLayout from "@/Layouts/Form";

export default function Create({}: PageProps) {
    // Initialize form state with empty values
    const { data, setData, post, processing, errors, reset } =
        useForm<CategoryFormData>({
            name: "",
            description: "",
        });

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

    /**
     * Validates all fields before sending to server
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Run client-side validation before submitting
        if (validateAll()) {
            post(route("categories.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Create Category
                </h2>
            }
        >
            <Head title="Create Category" />

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
                    submitButtonText="Create Category"
                    isEdit={false}
                />
            </FormLayout>
        </AuthenticatedLayout>
    );
}
