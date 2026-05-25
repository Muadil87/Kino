<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommunityPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['nullable', 'in:discussion,recommendation,progress,challenge'],
            'content' => ['required', 'string', 'max:2000'],
            'tmdb_id' => ['nullable', 'integer'],
            'title' => ['nullable', 'string', 'max:255'],
            'poster_path' => ['nullable', 'string', 'max:255'],
            'release_date' => ['nullable', 'string', 'max:50'],
        ];
    }
}

