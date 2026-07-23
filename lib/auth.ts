import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { DatabaseService } from './database';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || 'smartinvoice-jwt-secret-key-neon-db-2026';
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
      return null;
    }
  }

  static async createUser(userData: {
    email: string;
    password?: string;
    name: string;
    company?: string;
  }): Promise<{ user: User; exists: boolean }> {
    let hashedPassword = '';
    if (userData.password) {
      hashedPassword = await this.hashPassword(userData.password);
    }

    const result = await DatabaseService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return result;
  }

  static async authenticateUser(email: string, password?: string): Promise<User | null> {
    const user = await DatabaseService.getUserByEmail(email);
    if (!user) {
      return null;
    }

    if (password && user.password) {
      const isValidPassword = await this.comparePassword(password, user.password);
      if (!isValidPassword) {
        return null;
      }
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getUserById(id: string): Promise<User | null> {
    return await DatabaseService.getUserById(id);
  }

  static async getUserFromRequest(request: NextRequest): Promise<User | null> {
    try {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      let token: string | null = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        const cookieStore = request.cookies;
        token = cookieStore.get('auth-token')?.value || cookieStore.get('token')?.value || null;
      }

      if (!token) return null;

      const decoded = this.verifyToken(token);
      if (!decoded || !decoded.userId) return null;

      const user = await this.getUserById(decoded.userId);
      if (!user) return null;

      if (user && 'password' in user) {
        const { password, ...userWithoutPassword } = user as any;
        return userWithoutPassword;
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