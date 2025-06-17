import { FormEventHandler } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import Checkbox from "@/Components/Checkbox";
import SelectInput from "@/Components/SelectInput";
import { Link } from "@inertiajs/react";
import { BookmarkFormData } from "@/hooks";
import { Category } from "@/types";

interface BookmarkFormProps {
    data: BookmarkFormData;
    onSubmit: FormEventHandler;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onArchivedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    categories: Category[];
    errors: Record<string, string>; // Server-side validation errors
    validationErrors: Record<string, string>; // Client-side validation errors
    processing: boolean;
    isFormValid: boolean;
    submitButtonText: string;
    isEdit?: boolean;
}

export default function BookmarkForm({
    data,
    onSubmit,
    onTitleChange,
    onUrlChange,
    onDescriptionChange,
    onCategoryChange,
    onArchivedChange,
    categories,
    errors,
    validationErrors,
    processing,
    isFormValid,
    submitButtonText,
    isEdit = false,
}: BookmarkFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    name="title"
                    value={data.title}
                    className="mt-1 block w-full"
                    autoComplete="off"
                    isFocused={!isEdit} // Only auto-focus on create forms
                    onChange={onTitleChange}
                    required
                    minLength={2}
                    maxLength={255}
                />
                <InputError
                    message={errors.title || validationErrors.title}
                    className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    {isEdit
                        ? "A descriptive title for your bookmark."
                        : "The name or short description of the website (max 255 characters)."}
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
                    onChange={onUrlChange}
                    required
                    placeholder={!isEdit ? "https://example.com" : undefined}
                />
                <InputError
                    message={errors.url || validationErrors.url}
                    className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    {isEdit
                        ? "The full URL of the website (including https://)."
                        : "Only HTTP and HTTPS URLs are allowed for security reasons."}
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
                    onChange={onDescriptionChange}
                    rows={isEdit ? 3 : 4}
                    maxLength={1000}
                />
                <InputError
                    message={errors.description || validationErrors.description}
                    className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    {isEdit
                        ? "A brief description of the website (max 1000 characters)."
                        : "Brief description of the bookmark. HTML tags and scripts are not allowed. (max 1000 characters)"}
                </p>
            </div>

            {/* Category Selection */}
            <div>
                <InputLabel htmlFor="category_id" value="Category" />
                {isEdit ? (
                    <SelectInput
                        id="category_id"
                        name="category_id"
                        value={data.category_id}
                        className="mt-1 block w-full"
                        onChange={onCategoryChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id.toString()}
                            >
                                {category.name}
                            </option>
                        ))}
                    </SelectInput>
                ) : (
                    <select
                        id="category_id"
                        name="category_id"
                        value={data.category_id}
                        className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={onCategoryChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id.toString()}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                )}
                <InputError
                    message={errors.category_id || validationErrors.category_id}
                    className="mt-2"
                />
            </div>

            {/* Archive Checkbox */}
            <div className="block">
                <label className="flex items-center">
                    <Checkbox
                        name="is_archived"
                        checked={data.is_archived}
                        onChange={onArchivedChange}
                    />
                    <span className="ml-2 text-sm text-muted-foreground">
                        Archive this bookmark
                    </span>
                </label>
                {isEdit && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        Archived bookmarks are hidden from your main view.
                    </p>
                )}
                <InputError message={errors.is_archived} className="mt-2" />
            </div>

            {/* Form Actions */}
            <BookmarkFormActions
                processing={processing}
                isFormValid={isFormValid}
                submitButtonText={submitButtonText}
                isEdit={isEdit}
            />
        </form>
    );
}

interface BookmarkFormActionsProps {
    processing: boolean;
    isFormValid: boolean;
    submitButtonText: string;
    isEdit: boolean;
}

function BookmarkFormActions({
    processing,
    isFormValid,
    submitButtonText,
    isEdit,
}: BookmarkFormActionsProps) {
    if (isEdit) {
        // Edit form has different button layout with Back to Dashboard
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
