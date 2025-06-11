<?php

namespace App\Http\Requests;

use App\Models\Bookmark;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class BookmarkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'url' => [
                'required',
                'string',
                'url',
                'max:2048',
                Rule::unique(Bookmark::class)
                    ->where('user_id', Auth::id())
                    ->ignore($this->route('bookmark')),
            ],
            'description' => 'nullable|string|max:1000',
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                }),
            ],
            'is_archived' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Please provide a title for your bookmark.',
            'title.min' => 'The bookmark title must be at least 2 characters.',

            'url.required' => 'Please provide a URL for your bookmark.',
            'url.url' => 'Please enter a valid URL starting with http:// or https://.',
            'url.max' => 'The URL is too long. Maximum length is 2048 characters.',
            'url.unique' => 'This URL has already been bookmarked by you. Please use a different URL.',

            'description.max' => 'The description cannot exceed 1000 characters.',

            'category_id.required' => 'Please select a category for your bookmark.',
            'category_id.exists' => 'The selected category does not exist or does not belong to you.',
        ];
    }
}
