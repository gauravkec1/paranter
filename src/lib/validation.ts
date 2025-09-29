import { z } from 'zod';

// Authentication form validation schemas
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .refine(
      (value) => {
        // Allow email format, phone number (10+ digits), or school ID (alphanumeric)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        const schoolIdRegex = /^[a-zA-Z0-9]{3,20}$/;
        
        return emailRegex.test(value) || phoneRegex.test(value) || schoolIdRegex.test(value);
      },
      { message: "Please enter a valid email, phone number, or school ID" }
    ),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
    }),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(100, { message: "Full name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { 
      message: "Full name can only contain letters, spaces, hyphens, and apostrophes" 
    }),
  role: z.string().refine(
    (value) => ['parent', 'teacher', 'admin', 'staff', 'driver'].includes(value),
    { message: "Please select a valid role" }
  ),
});

// Profile update validation
export const profileUpdateSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(100, { message: "Full name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { 
      message: "Full name can only contain letters, spaces, hyphens, and apostrophes" 
    }),
  phone: z.string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^\+?[\d\s-()]{10,}$/.test(value),
      { message: "Please enter a valid phone number" }
    ),
});

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;