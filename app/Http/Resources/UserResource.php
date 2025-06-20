<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'avatar_url' => $this->avatar_url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'bookmarks_count' => $this->whenCounted('bookmarks'),
            'categories_count' => $this->whenCounted('categories'),
            'bookmarks' => BookmarkResource::collection($this->whenLoaded('bookmarks')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
        ];
    }
}