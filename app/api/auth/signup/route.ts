import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, company } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const userExists = await AuthService.userExists(email);
    if (userExists) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in instead.', userExists: true },
        { status: 409 }
      );
    }

    const { user, exists } = await AuthService.createUser({
      email,
      password,
      name,
      company,
    });

    if (exists) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in instead.', userExists: true },
        { status: 409 }
      );
    }

    const token = AuthService.generateToken(user.id);

    return NextResponse.json({
      user,
      token,
      message: 'Account created successfully!'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}