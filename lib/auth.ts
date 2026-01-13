import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { DatabaseService, supabase } from './database';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET environment variable is not set');
    throw new Error('JWT_SECRET environment variable is not set. Please set it in your environment variables for security.');
  }
  if (secret === 'your-super-secret-jwt-key-change-in-production') {
    console.error('JWT_SECRET is using the default value. Please change it in production.');
    throw new Error('JWT_SECRET environment variable is using the default value. Please set a secure secret in your environment variables.');
  }
  return secret;
}

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  companyAddress?: string;
  companyGST?: string;
  companyPhone?: string;
  companyWebsite?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  user: User;
  userId: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret) as unknown as { userId: string };
      return decoded;
    } catch (error) {
      // This is expected if using Supabase tokens
      // console.debug('Local token verification failed (may be Supabase token):', error);
      return null;
    }
  }

  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    company?: string;
  }): Promise<{ user: User; exists: boolean }> {
    const hashedPassword = await this.hashPassword(userData.password);

    const result = await DatabaseService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return result;
  }

  static async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await DatabaseService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getUserById(id: string): Promise<User | null> {
    return await DatabaseService.getUserById(id);
  }

  static async getUserFromRequest(request: NextRequest): Promise<User | null> {
    try {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // console.log('No valid authorization header found');
        return null;
      }

      const token = authHeader.substring(7);
      let userId: string | null = null;
      let userEmail: string | undefined;
      let userName: string | undefined;
      let userAvatar: string | undefined;

      // 1. Try verifying as local JWT
      const decoded = this.verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      } else {
        // 2. Try verifying as Supabase token
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
          console.error('Supabase getUser error:', error.message);
        }
        if (!error && user) {
          userId = user.id;
          userEmail = user.email;
          userName = user.user_metadata?.full_name || user.email?.split('@')[0];
          userAvatar = user.user_metadata?.avatar_url;
        }
      }

      if (!userId) {
        // console.log('Token verification failed for both Local and Supabase');
        return null;
      }

      // 3. Get user from DB
      let user = await this.getUserById(userId);

      // 4. Handle Missing User
      if (!user && userEmail) {
        // Check if user exists by Email (Duplicate check)
        const existingUserByEmail = await DatabaseService.getUserByEmail(userEmail);

        if (existingUserByEmail) {
          console.log(`User found by email ${userEmail} with old ID ${existingUserByEmail.id}. Attempting to migrate to new Auth ID ${userId}...`);

          // Attempt UPDATE ID
          const { error: updateError } = await supabase
            .from('users')
            .update({ id: userId, avatar: userAvatar, updatedat: new Date().toISOString() })
            .eq('email', userEmail);

          if (updateError) {
            console.error('Failed to migrate user ID. Logging in as legacy user.', updateError);
            user = { ...existingUserByEmail };
          } else {
            console.log('User ID migrated successfully.');
            user = await this.getUserById(userId);
          }
        } else {
          console.log(`User ${userId} authenticated but missing in DB. Auto-creating...`);
          try {
            const placeholderPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await AuthService.hashPassword(placeholderPassword);

            const { data: newUser, error: createError } = await supabase.from('users').insert([{
              id: userId,
              email: userEmail,
              name: userName || 'User',
              avatar: userAvatar,
              password: hashedPassword,
              company: '',
              createdat: new Date().toISOString(),
              updatedat: new Date().toISOString()
            }]).select().single();

            if (createError) {
              console.error('Auto-create INSERT failed:', createError);
            } else if (!newUser) {
              console.error('Auto-create succeeded but returned no data');
            } else {
              console.log('Auto-create success:', newUser.id);
              user = await this.getUserById(userId);
            }
          } catch (err) {
            console.error('Failed to auto-create user (exception):', err);
          }
        }
      }

      return user;
    } catch (error) {
      console.error('Error in getUserFromRequest:', error);
      return null;
    }
  }

  static async userExists(email: string): Promise<boolean> {
    const user = await DatabaseService.getUserByEmail(email);
    return !!user;
  }
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult | null> {
  const user = await AuthService.getUserFromRequest(request);
  if (!user) {
    return null;
  }

  return {
    user,
    userId: user.id
  };
}