// app/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Email/Username and password are required');
        }

        try {
          await dbConnect();
          
          // Check if identifier is email or username
          const isEmail = credentials.identifier.includes('@');
          
          let user;
          if (isEmail) {
            user = await User.findOne({ email: credentials.identifier }).select("+password").lean();
          } else {
            user = await User.findOne({ username: credentials.identifier }).select("+password").lean();
          }
          
          
          if (!user) {
            throw new Error('No user found with this email/username');
          }
          
          if (!user.password) {
            throw new Error('Please sign in with Google or reset your password');
          }
          
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) {
            throw new Error('Invalid password');
          }
          
          return {
            id: String(user._id),
            email: user.email,
            username: user.username,
            isverified: user.isverified,
            phone_number: user.phone_number,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user for Google sign-in
            const newUser = new User({
              email: user.email,
              username: user.name || user.email?.split('@')[0],
              full_name: user.name,
              isverified: true, // Google accounts are pre-verified
              verification_method: 'google',
              verification_timestamps: [new Date()],
              verification_status_history: ['verified'],
              admin_approval: true,
            });
            
            await newUser.save();
          }
          
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = (user as any).email || user.email;
        token.username = (user as any).username || user.name;
        token.isverified = (user as any).isverified ?? true;
        token.phone_number = (user as any).phone_number;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.username as string,
        isverified: token.isverified as boolean,
        phone_number: token.phone_number as string,
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
};