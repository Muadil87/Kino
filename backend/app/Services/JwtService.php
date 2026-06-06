<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Carbon;

class JwtService
{
    public function issueToken(User $user): string
    {
        $issuedAt = now()->timestamp;
        $expiresAt = Carbon::createFromTimestamp($issuedAt)
            ->addMinutes((int) config('jwt.ttl', 10080))
            ->timestamp;

        $payload = [
            'iss' => (string) config('jwt.issuer', config('app.name', 'kino')),
            'sub' => (string) $user->getKey(),
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'ver' => (int) ($user->token_version ?? 0),
        ];

        return $this->encode($payload);
    }

    public function ttlInSeconds(): int
    {
        return (int) config('jwt.ttl', 10080) * 60;
    }

    public function resolveUser(?string $token): ?User
    {
        $payload = $this->decode($token);

        if ($payload === null || !isset($payload['sub'])) {
            return null;
        }

        $user = User::find($payload['sub']);

        if ($user === null) {
            return null;
        }

        if ((int) ($payload['ver'] ?? -1) !== (int) ($user->token_version ?? 0)) {
            return null;
        }

        return $user;
    }

    public function decode(?string $token): ?array
    {
        if (!is_string($token) || trim($token) === '') {
            return null;
        }

        $segments = explode('.', $token);

        if (count($segments) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $segments;

        $header = $this->decodeSegment($encodedHeader);
        $payload = $this->decodeSegment($encodedPayload);
        $signature = $this->base64UrlDecode($encodedSignature);

        if (!is_array($header) || !is_array($payload) || $signature === null) {
            return null;
        }

        if (($header['alg'] ?? null) !== 'HS256') {
            return null;
        }

        $expectedSignature = hash_hmac('sha256', $encodedHeader.'.'.$encodedPayload, $this->secret(), true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $now = now()->timestamp;
        $leeway = (int) config('jwt.leeway', 0);

        if (!isset($payload['exp']) || (int) $payload['exp'] < ($now - $leeway)) {
            return null;
        }

        if (isset($payload['iat']) && (int) $payload['iat'] > ($now + $leeway)) {
            return null;
        }

        if (($payload['iss'] ?? null) !== (string) config('jwt.issuer', config('app.name', 'kino'))) {
            return null;
        }

        return $payload;
    }

    private function encode(array $payload): string
    {
        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT',
        ];

        $encodedHeader = $this->base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR));
        $encodedPayload = $this->base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));
        $signature = hash_hmac('sha256', $encodedHeader.'.'.$encodedPayload, $this->secret(), true);

        return $encodedHeader.'.'.$encodedPayload.'.'.$this->base64UrlEncode($signature);
    }

    private function decodeSegment(string $segment): ?array
    {
        $decoded = $this->base64UrlDecode($segment);

        if ($decoded === null) {
            return null;
        }

        $data = json_decode($decoded, true);

        return is_array($data) ? $data : null;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): ?string
    {
        $remainder = strlen($value) % 4;
        $padded = $remainder === 0 ? $value : $value.str_repeat('=', 4 - $remainder);
        $decoded = base64_decode(strtr($padded, '-_', '+/'), true);

        return $decoded === false ? null : $decoded;
    }

    private function secret(): string
    {
        $secret = (string) config('jwt.secret', '');

        if (str_starts_with($secret, 'base64:')) {
            $decoded = base64_decode(substr($secret, 7), true);

            if ($decoded !== false) {
                return $decoded;
            }
        }

        return $secret;
    }
}
