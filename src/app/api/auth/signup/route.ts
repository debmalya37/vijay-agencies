// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, username, password, phone_number } = await request.json();
    
    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required', ok: false },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address', ok: false },
        { status: 400 }
      );
    }
    
    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long', ok: false },
        { status: 400 }
      );
    }
    
    // Phone number validation (optional but if provided should be valid)
    if (phone_number) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone_number.replace(/\s/g, ''))) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number', ok: false },
          { status: 400 }
        );
      }
    }
    
    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists', ok: false },
        { status: 409 }
      );
    }
    
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already taken', ok: false },
        { status: 409 }
      );
    }
    
    // Create new user (password will be hashed in UserSchema pre-save hook)
    const newUser = new User({
      email,
      username,
      password, // plain text → will be hashed automatically in model
      phone_number: phone_number || '',
      isverified: false,
      verification_method: 'email',
      verification_timestamps: [new Date()],
      verification_status_history: ['pending'],
      admin_approval: false,
    });
    
    await newUser.save();
    
    return NextResponse.json(
      { 
        message: 'User created successfully', 
        ok: true,
        user: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          phone_number: newUser.phone_number,
          isverified: newUser.isverified
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', ok: false },
      { status: 500 }
    );
  }
}
