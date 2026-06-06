<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class JwtAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_returns_a_jwt_and_allows_authenticated_requests(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.email', 'jane@example.com');

        $token = $response->json('token');

        $this->assertIsString($token);
        $this->assertCount(3, explode('.', $token));

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('email', 'jane@example.com');
    }

    public function test_login_returns_a_jwt_for_valid_credentials(): void
    {
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'secret123',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.email', 'john@example.com');

        $this->assertCount(3, explode('.', $response->json('token')));
    }

    public function test_logout_revokes_the_current_jwt(): void
    {
        $token = $this->postJson('/api/register', [
            'name' => 'Alex Doe',
            'email' => 'alex@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->json('token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout')
            ->assertOk();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/user')
            ->assertUnauthorized();
    }
}
