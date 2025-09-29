import { z } from 'zod';

// Input validation schemas for security
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const signupSchema = z.object({
  email: z.string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "Password must contain at least one lowercase letter, one uppercase letter, and one number" 
    }),
  fullName: z.string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  role: z.enum(['parent', 'teacher', 'admin', 'staff', 'driver'], {
    message: "Invalid role selected"
  })
});

export const messageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
  subject: z.string()
    .trim()
    .max(200, { message: "Subject must be less than 200 characters" })
    .optional(),
  recipientId: z.string().uuid({ message: "Invalid recipient ID" })
});

export const profileUpdateSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  phone: z.string()
    .trim()
    .regex(/^[+]?[\d\s-()]+$/, { message: "Invalid phone number format" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal(''))
});

// Sanitization functions
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"/\\]/g, '');
};

// Rate limiting helper
class RateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (now > userAttempts.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (userAttempts.count >= this.maxAttempts) {
      return true;
    }

    userAttempts.count++;
    return false;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) return 0;
    return Math.max(0, userAttempts.resetTime - Date.now());
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const generalRateLimiter = new RateLimiter(50, 60 * 1000); // 50 requests per minute

// Security headers validation
export const validateSecurityHeaders = (): boolean => {
  const isHTTPS = window.location.protocol === 'https:';
  const hasSecureCookies = document.cookie.includes('Secure');
  
  if (!isHTTPS && window.location.hostname !== 'localhost') {
    console.warn('⚠️ Application should be served over HTTPS in production');
    return false;
  }
  
  return true;
};

// XSS Protection
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// SQL Injection Prevention (for any direct query building)
export const sanitizeSqlInput = (input: string): string => {
  return input.replace(/['"\\;]/g, '');
};

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;