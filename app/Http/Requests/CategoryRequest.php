<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class CategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Preparing the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('name') && !$this->filled('slug')) {
            $this->merge([
                'slug' => Str::slug($this->input('name')),
            ]);
        }

        // Add category_limit field for validation
        if ($this->isMethod('post')) {
            $this->merge(['category_limit' => true]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique(Category::class)
                    ->where('user_id', Auth::id())
                    ->ignore($this->route('category')),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique(Category::class)
                    ->where('user_id', Auth::id())
                    ->ignore($this->route('category')),
            ],
            'description' => 'nullable|string|max:1000',
        ];

        if ($this->isMethod('post')) {
            $rules['category_limit'] = ['required', function ($attribute, $value, $fail) {
                $maxCategories = 8;
                $currentCount = Auth::user()->categories()->count();

                if ($currentCount >= $maxCategories) {
                    $fail("You've reached the maximum limit of {$maxCategories} categories.");
                }
            }];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please provide a name for your category.',
            'name.min' => 'The category name must be at least 2 characters.',
            'name.unique' => 'You already have a category with this name.',

            'slug.required' => 'The category URL slug is required.',
            'slug.regex' => 'The URL slug can only contain lowercase letters, numbers, and hyphens.',
            'slug.unique' => 'This URL slug is already in use. Please try a different one.',

            'description.max' => 'The description cannot exceed 1000 characters.',

            'category_limit.required' => 'Category limit validation failed.',
        ];
    }
}
