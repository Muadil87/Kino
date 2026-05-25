<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $this->user()?->id],
            'bio' => ['nullable', 'string', 'max:1000'],
            'favorite_genres' => ['nullable', 'array', 'max:8'],
            'favorite_genres.*' => ['string', 'max:40'],
            'favorite_movie' => ['nullable', 'string', 'max:120'],
            'favorite_movie_poster_path' => ['nullable', 'string', 'max:255'],
            'favorite_movie_year' => ['nullable', 'integer', 'min:1880', 'max:2100'],
            'favorite_director' => ['nullable', 'string', 'max:120'],
            'favorite_director_image_path' => ['nullable', 'string', 'max:255'],
        ];
    }
}
