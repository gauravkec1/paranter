import { z } from 'zod';

// Authentication validation schemas
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  });

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Profile validation schemas
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s\-\(\)]+$/, { message: "Invalid phone number format" })
  .min(10, { message: "Phone number must be at least 10 digits" })
  .max(20, { message: "Phone number must be less than 20 characters" })
  .optional()
  .or(z.literal(''));

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name must be less than 100 characters" }),
  phone: phoneSchema,
});

// Message validation schema
export const messageSchema = z.object({
  subject: z
    .string()
    .trim()
    .max(200, { message: "Subject must be less than 200 characters" })
    .optional(),
  content: z
    .string()
    .trim()
    .min(1, { message: "Message content is required" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
});

// Assignment validation schema
export const assignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional(),
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(100, { message: "Subject must be less than 100 characters" }),
  instructions: z
    .string()
    .trim()
    .max(2000, { message: "Instructions must be less than 2000 characters" })
    .optional(),
  total_marks: z
    .number()
    .int()
    .min(1, { message: "Total marks must be at least 1" })
    .max(1000, { message: "Total marks must be less than 1000" })
    .optional(),
  due_date: z.date({ message: "Due date is required" }),
});

// Student validation schema
export const studentSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name must be less than 100 characters" }),
  student_id: z
    .string()
    .trim()
    .min(1, { message: "Student ID is required" })
    .max(50, { message: "Student ID must be less than 50 characters" })
    .regex(/^[A-Za-z0-9\-_]+$/, { message: "Student ID can only contain letters, numbers, hyphens, and underscores" }),
  grade_level: z
    .string()
    .trim()
    .max(20, { message: "Grade level must be less than 20 characters" })
    .optional(),
  class_section: z
    .string()
    .trim()
    .max(20, { message: "Class section must be less than 20 characters" })
    .optional(),
  date_of_birth: z.date().optional(),
});

// Fee validation schema
export const feeSchema = z.object({
  fee_type: z
    .string()
    .trim()
    .min(1, { message: "Fee type is required" })
    .max(100, { message: "Fee type must be less than 100 characters" }),
  amount: z
    .number()
    .positive({ message: "Amount must be positive" })
    .max(999999.99, { message: "Amount must be less than 1,000,000" }),
  due_date: z.date({ message: "Due date is required" }),
  description: z
    .string()
    .trim()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
});

// Utility function to sanitize HTML content
export const sanitizeText = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Utility function for safe logging (removes sensitive data)
export const sanitizeForLogging = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth', 'email'];
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  });
  
  return sanitized;
};