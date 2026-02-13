<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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

        // C. Create a token (The "ID Card" for the user)
        $token = $user->createToken('kino_token')->plainTextToken;

        // D. Send response back to React
        return response()->json([
            'user' => $user,
            'token' => $token,
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

        // C. Generate Token
        $token = $user->createToken('kino_token')->plainTextToken;

        // D. Return response
        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Logged in successfully!'
        ], 200);
    }

    // 3. LOGOUT
    public function logout(Request $request)
    {
        // Delete the token (Revoke the ID Card)
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}