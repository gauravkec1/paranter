import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cacheManager, performanceMonitor } from '@/lib/performance';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type Student = Tables['students']['Row'];
type Attendance = Tables['attendance']['Row'];
type Fee = Tables['fees']['Row'];
type Assignment = Tables['assignments']['Row'];
type SchoolEvent = Tables['school_events']['Row'];
type Message = Tables['messages']['Row'];

interface ParentDashboardData {
  students: Student[];
  attendance: Attendance[];
  fees: Fee[];
  assignments: Assignment[];
  events: SchoolEvent[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const CACHE_KEYS = {
  STUDENTS: 'parent_students',
  ATTENDANCE: 'parent_attendance',
  FEES: 'parent_fees',
  ASSIGNMENTS: 'parent_assignments',
  EVENTS: 'parent_events',
  MESSAGES: 'parent_messages'
};

export const useParentDashboard = (userId: string | null): ParentDashboardData => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        performanceMonitor.markStart('parent-dashboard-load');

        // Check cache first for quick loading
        const cachedStudents = cacheManager.get(CACHE_KEYS.STUDENTS);
        if (cachedStudents) {
          setStudents(cachedStudents);
        }

        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .eq('parent_id', userId)
          .eq('is_active', true);

        if (studentsError) throw studentsError;

        const validStudents = studentsData || [];
        setStudents(validStudents);
        cacheManager.set(CACHE_KEYS.STUDENTS, validStudents);

        if (validStudents.length === 0) {
          setIsLoading(false);
          performanceMonitor.markEnd('parent-dashboard-load');
          return;
        }

        const studentIds = validStudents.map(s => s.id);

        // Parallel data fetching for better performance
        const [
          attendanceResult,
          feesResult,
          assignmentsResult,
          eventsResult,
          messagesResult
        ] = await Promise.allSettled([
          // Fetch recent attendance (last 30 days)
          supabase
            .from('attendance')
            .select('*')
            .in('student_id', studentIds)
            .gte('attendance_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order('attendance_date', { ascending: false }),

          // Fetch pending and recent fees
          supabase
            .from('fees')
            .select('*')
            .in('student_id', studentIds)
            .in('status', ['pending', 'overdue', 'paid'])
            .order('due_date', { ascending: false }),

          // Fetch recent assignments (last 60 days)
          supabase
            .from('assignments')
            .select(`
              *,
              assignment_submissions!left (
                id,
                student_id,
                submitted_at,
                marks_obtained,
                feedback
              )
            `)
            .gte('due_date', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order('due_date', { ascending: false }),

          // Fetch upcoming school events (next 90 days)
          supabase
            .from('school_events')
            .select('*')
            .eq('is_active', true)
            .gte('event_date', new Date().toISOString().split('T')[0])
            .lte('event_date', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order('event_date', { ascending: true }),

          // Fetch recent messages (last 30 days)
          supabase
            .from('messages')
            .select('*')
            .eq('recipient_id', userId)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false })
            .limit(20)
        ]);

        // Process results and handle errors gracefully
        if (attendanceResult.status === 'fulfilled' && attendanceResult.value.data) {
          const attendanceData = attendanceResult.value.data;
          setAttendance(attendanceData);
          cacheManager.set(CACHE_KEYS.ATTENDANCE, attendanceData);
        } else {
          console.warn('Failed to fetch attendance:', attendanceResult.status === 'rejected' ? attendanceResult.reason : 'No data');
        }

        if (feesResult.status === 'fulfilled' && feesResult.value.data) {
          const feesData = feesResult.value.data;
          setFees(feesData);
          cacheManager.set(CACHE_KEYS.FEES, feesData);
        } else {
          console.warn('Failed to fetch fees:', feesResult.status === 'rejected' ? feesResult.reason : 'No data');
        }

        if (assignmentsResult.status === 'fulfilled' && assignmentsResult.value.data) {
          const assignmentsData = assignmentsResult.value.data;
          setAssignments(assignmentsData);
          cacheManager.set(CACHE_KEYS.ASSIGNMENTS, assignmentsData);
        } else {
          console.warn('Failed to fetch assignments:', assignmentsResult.status === 'rejected' ? assignmentsResult.reason : 'No data');
        }

        if (eventsResult.status === 'fulfilled' && eventsResult.value.data) {
          const eventsData = eventsResult.value.data;
          setEvents(eventsData);
          cacheManager.set(CACHE_KEYS.EVENTS, eventsData);
        } else {
          console.warn('Failed to fetch events:', eventsResult.status === 'rejected' ? eventsResult.reason : 'No data');
        }

        if (messagesResult.status === 'fulfilled' && messagesResult.value.data) {
          const messagesData = messagesResult.value.data;
          setMessages(messagesData);
          cacheManager.set(CACHE_KEYS.MESSAGES, messagesData);
        } else {
          console.warn('Failed to fetch messages:', messagesResult.status === 'rejected' ? messagesResult.reason : 'No data');
        }

        performanceMonitor.markEnd('parent-dashboard-load');
      } catch (error: any) {
        console.error('❌ Parent dashboard data fetch failed:', error);
        setError(error.message || 'Failed to load dashboard data');
        performanceMonitor.markEnd('parent-dashboard-load');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    students,
    attendance,
    fees,
    assignments,
    events,
    messages,
    isLoading,
    error
  };
};