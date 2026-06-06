<?php

return [
    'secret' => env('JWT_SECRET', env('APP_KEY', 'kino-default-jwt-secret')),
    'ttl' => (int) env('JWT_TTL', 10080),
    'issuer' => env('JWT_ISSUER', env('APP_NAME', 'kino')),
    'leeway' => (int) env('JWT_LEEWAY', 0),
];
