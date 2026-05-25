<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecommendationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'tmdb_id' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'poster_path' => ['nullable', 'string', 'max:255'],
            'release_date' => ['nullable', 'string', 'max:50'],
            'to_user_id' => ['nullable', 'integer', 'exists:users,id', 'required_without:community_id'],
            'community_id' => ['nullable', 'integer', 'exists:communities,id', 'required_without:to_user_id'],
            'note' => ['nullable', 'string', 'max:500'],
        ];
    }
}

