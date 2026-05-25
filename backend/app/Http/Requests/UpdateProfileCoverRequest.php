<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileCoverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'cover' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:4096'],
        ];
    }
}
