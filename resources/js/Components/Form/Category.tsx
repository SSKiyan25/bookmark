import { FormEventHandler } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import { Link } from "@inertiajs/react";
import { CategoryFormData } from "@/hooks";

interface CategoryFormProps {
    data: CategoryFormData;
    onSubmit: FormEventHandler;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    errors: Record<string, string>;
    validationErrors: Record<string, string>;
    processing: boolean;
    isFormValid: boolean;
    submitButtonText: string;
    isEdit?: boolean;
}

export default function CategoryForm({
    data,
    onSubmit,
    onNameChange,
    onDescriptionChange,
    errors,
    validationErrors,
    processing,
    isFormValid,
    submitButtonText,
    isEdit = false,
}: CategoryFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Category Name Field */}
            <div>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="off"
                    isFocused={!isEdit} // Only auto-focus on create forms
                    onChange={onNameChange}
                    required
                    minLength={2}
                    maxLength={255}
                />
                <InputError
                    message={errors.name || validationErrors.name}
                    className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    A short, descriptive name for your category (max 255
                    characters).
                </p>
            </div>

            {/* Category Description Field */}
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
                    onChange={onDescriptionChange}
                    rows={4}
                    maxLength={1000}
                />
                <InputError
                    message={errors.description || validationErrors.description}
                    className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    A brief description of what this category is for (max 1000
                    characters).
                </p>
            </div>

            {/* Form Actions */}
            <CategoryFormActions
                processing={processing}
                isFormValid={isFormValid}
                submitButtonText={submitButtonText}
                isEdit={isEdit}
            />
        </form>
    );
}

/**
 * Form action buttons component
 */
interface CategoryFormActionsProps {
    processing: boolean;
    isFormValid: boolean;
    submitButtonText: string;
    isEdit: boolean;
}

function CategoryFormActions({
    processing,
    isFormValid,
    submitButtonText,
    isEdit,
}: CategoryFormActionsProps) {
    if (isEdit) {
        // Edit form has different button layout
        return (
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
                        disabled={processing || !isFormValid}
                    >
                        {submitButtonText}
                    </PrimaryButton>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end gap-4">
            <Link
                href={route("dashboard")}
                className="rounded-md px-4 py-2 text-muted-foreground underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                Cancel
            </Link>
            <PrimaryButton
                className="ml-4"
                disabled={processing || !isFormValid}
            >
                {submitButtonText}
            </PrimaryButton>
        </div>
    );
}
