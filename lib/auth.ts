import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

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
  aiProvider?: string;
  aiApiKey?: string;
  aiModel?: string;
  aiBaseUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  user: User;
  userId: string;
}

function formatPrismaUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    company: user.company || undefined,
    companyAddress: user.address || undefined,
    companyGST: user.gstNumber || undefined,
    companyPhone: user.phone || undefined,
    companyWebsite: user.companyWebsite || undefined,
    avatar: user.avatar || undefined,
    aiProvider: user.aiProvider || user.aiprovider || 'gemini',
    aiApiKey: user.aiApiKey || user.aiapikey || undefined,
    aiModel: user.aiModel || user.aimodel || undefined,
    aiBaseUrl: user.aiBaseUrl || user.aibaseurl || undefined,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
  };
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
    avatar?: string;
  }): Promise<{ user: User; exists: boolean }> {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase() },
      });

      if (existing) {
        return { user: formatPrismaUser(existing), exists: true };
      }

      let hashedPassword = '';
      if (userData.password) {
        hashedPassword = await this.hashPassword(userData.password);
      }

      const now = new Date().toISOString();
      const created = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase(),
          password: hashedPassword,
          name: userData.name,
          company: userData.company || null,
          avatar: userData.avatar || null,
          createdAt: now,
          updatedAt: now,
        },
      });

      return { user: formatPrismaUser(created), exists: false };
    } catch (error) {
      console.error('Error creating user via Prisma:', error);
      throw error;
    }
  }

  static async authenticateUser(email: string, password?: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user) return null;

      if (password && user.password) {
        const isValidPassword = await this.comparePassword(password, user.password);
        if (!isValidPassword) {
          return null;
        }
      }

      return formatPrismaUser(user);
    } catch (error) {
      console.error('Error authenticating user via Prisma:', error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) return null;
      return formatPrismaUser(user);
    } catch (error) {
      console.error('Error getting user by id via Prisma:', error);
      return null;
    }
  }

  static async userExists(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: { id: true },
      });
      return !!user;
    } catch (error) {
      console.error('Error checking user existence via Prisma:', error);
      return false;
    }
  }

  static async upsertGoogleUser(data: {
    email: string;
    name: string;
    avatar?: string;
  }): Promise<User> {
    try {
      const email = data.email.toLowerCase();
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      const now = new Date().toISOString();

      if (existing) {
        const updated = await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: existing.name || data.name,
            avatar: existing.avatar || data.avatar || null,
            updatedAt: now,
          },
        });
        return formatPrismaUser(updated);
      }

      const created = await prisma.user.create({
        data: {
          email,
          name: data.name || email.split('@')[0],
          password: '',
          avatar: data.avatar || null,
          createdAt: now,
          updatedAt: now,
        },
      });

      return formatPrismaUser(created);
    } catch (error) {
      console.error('Error upserting Google user via Prisma:', error);
      throw error;
    }
  }

  static async getUserFromRequest(request: NextRequest): Promise<User | null> {
    try {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      let token: string | null = null;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const candidate = authHeader.substring(7).trim();
        if (candidate && candidate !== 'null' && candidate !== 'undefined') {
          token = candidate;
        }
      }

      if (!token) {
        const cookieStore = request.cookies;
        token = cookieStore.get('auth-token')?.value || 
                cookieStore.get('token')?.value || 
                cookieStore.get('sb-access-token')?.value || null;
      }

      if (!token) return null;

      const decoded = this.verifyToken(token);
      if (!decoded || !decoded.userId) return null;

      const user = await this.getUserById(decoded.userId);
      return user;
    } catch (error) {
      console.error('Error in getUserFromRequest:', error);
      return null;
    }
  }
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult | null> {
  const user = await AuthService.getUserFromRequest(request);
  if (!user) return null;
  return {
    user,
    userId: user.id,
  };
}