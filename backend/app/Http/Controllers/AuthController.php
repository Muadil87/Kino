<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private readonly JwtService $jwt)
    {
    }

    // 1. REGISTER (Sign Up)
    public function register(Request $request)
    {
        // A. Validate the data coming from React
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email', // Check if email already exists
            'password' => 'required|string|confirmed' // "confirmed" checks if password matches password_confirmation
        ]);

        // B. Create the user in the database
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']), // Always hash passwords!
        ]);

        // C. Issue a signed JWT for the new session
        $token = $this->jwt->issueToken($user);

        // D. Send response back to React
        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $this->jwt->ttlInSeconds(),
            'message' => 'User registered successfully!'
        ], 201);
    }

    // 2. LOGIN (Sign In)
    public function login(Request $request)
    {
        // A. Validate input
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        // B. Check credentials
        $user = User::where('email', $fields['email'])->first();

        // If user doesn't exist OR password doesn't match
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Bad credentials'
            ], 401);
        }

        // C. Generate a signed JWT
        $token = $this->jwt->issueToken($user);

        // D. Return response
        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $this->jwt->ttlInSeconds(),
            'message' => 'Logged in successfully!'
        ], 200);
    }

    // 3. LOGOUT
    public function logout(Request $request)
    {
        // Invalidate all currently-issued JWTs for this user.
        $request->user()->increment('token_version');

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
