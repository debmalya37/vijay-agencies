// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { usermail, username, password, phone_number } = await request.json();
    
    // Validation
    if (!usermail || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required', ok: false },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usermail)) {
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
    const existingUserByEmail = await User.findOne({ usermail });
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
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = new User({
      usermail,
      username,
      password: hashedPassword,
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
          usermail: newUser.usermail,
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