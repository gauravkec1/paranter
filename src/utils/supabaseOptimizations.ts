import { supabase } from '@/integrations/supabase/client';

// Common optimized queries with simplified types
export const optimizedQueries = {
  // Get user profile with minimal data
  getUserProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('id, user_id, email, full_name, role, is_active')
      .eq('user_id', userId)
      .maybeSingle();
  },

  // Get student attendance summary
  getStudentAttendance: async (studentId: string, limit: number = 10) => {
    return await supabase
      .from('attendance')
      .select('id, student_id, attendance_date, status, notes')
      .eq('student_id', studentId)
      .order('attendance_date', { ascending: false })
      .limit(limit);
  },

  // Get recent notifications
  getRecentNotifications: async (userId: string, limit: number = 5) => {
    return await supabase
      .from('notifications')
      .select('id, title, message, type, is_read, created_at')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  // Get fee summary
  getFeesSummary: async (studentId: string) => {
    return await supabase
      .from('fees')
      .select('id, student_id, fee_type, amount, due_date, status')
      .eq('student_id', studentId)
      .in('status', ['pending', 'overdue'])
      .order('due_date', { ascending: true });
  },
};

// Batch query executor
export const executeBatchQueries = async <T extends Record<string, any>>(
  queries: Record<keyof T, Promise<any>>
): Promise<T> => {
  const entries = Object.entries(queries);
  const results = await Promise.allSettled(
    entries.map(([, promise]) => promise)
  );

  const batchResult = {} as T;
  
  entries.forEach(([key], index) => {
    const result = results[index];
    if (result.status === 'fulfilled') {
      batchResult[key as keyof T] = result.value.data;
    } else {
      console.error(`Batch query failed for ${key}:`, result.reason);
      batchResult[key as keyof T] = null;
    }
  });

  return batchResult;
};