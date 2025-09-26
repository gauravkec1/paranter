import { supabase } from '@/integrations/supabase/client';

export interface StudentProfile {
  id: string;
  student_id: string;
  full_name: string;
  grade_level?: string;
  class_section?: string;
  avatar_url?: string;
  date_of_birth?: string;
  parent_id: string;
}

export interface AttendanceData {
  student_id: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  class_id: string;
  teacher_id: string;
  notes?: string;
}

export interface GradeData {
  student_id: string;
  subject: string;
  grade: string;
  percentage: number;
  test_date: string;
  test_type: string;
}

export interface FeeData {
  id: string;
  student_id: string;
  fee_type: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  description?: string;
}

export interface AnnouncementData {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  start_time?: string;
  end_time?: string;
}

export interface AssignmentData {
  id: string;
  title: string;
  subject: string;
  description?: string;
  due_date: string;
  teacher_id: string;
  class_id: string;
  total_marks?: number;
  attachment_url?: string;
  instructions?: string;
}

export const parentService = {
  // Get student profiles for the parent
  async getStudentProfiles(parentId: string): Promise<StudentProfile[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('parent_id', parentId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching student profiles:', error);
      return [];
    }
  },

  // Get attendance data for a student
  async getStudentAttendance(studentId: string, fromDate?: string): Promise<AttendanceData[]> {
    try {
      let query = supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('attendance_date', { ascending: false });

      if (fromDate) {
        query = query.gte('attendance_date', fromDate);
      }

      const { data, error } = await query.limit(30); // Last 30 records

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  },

  // Calculate attendance percentage
  calculateAttendancePercentage(attendanceRecords: AttendanceData[]): {
    overall: number;
    present: number;
    absent: number;
    total: number;
  } {
    if (!attendanceRecords.length) {
      return { overall: 0, present: 0, absent: 0, total: 0 };
    }

    const present = attendanceRecords.filter(record => record.status === 'present').length;
    const total = attendanceRecords.length;
    const absent = total - present;
    const overall = Math.round((present / total) * 100);

    return { overall, present, absent, total };
  },

  // Get student grades
  async getStudentGrades(studentId: string): Promise<GradeData[]> {
    try {
      // Note: This would need to be implemented based on your actual grades table structure
      // For now, returning empty array as grades table structure wasn't provided
      console.log('Grades service called for student:', studentId);
      return [];
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  },

  // Get fee information for a student
  async getStudentFees(studentId: string): Promise<FeeData[]> {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('student_id', studentId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching fees:', error);
      return [];
    }
  },

  // Calculate total due amount
  calculateTotalDue(fees: FeeData[]): number {
    return fees
      .filter(fee => fee.status === 'pending' || fee.status === 'overdue' || fee.status === 'partial')
      .reduce((total, fee) => total + fee.amount, 0);
  },

  // Get school announcements
  async getSchoolAnnouncements(limit: number = 10): Promise<AnnouncementData[]> {
    try {
      const { data, error } = await supabase
        .from('school_events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  },

  // Get assignments for student's class
  async getStudentAssignments(studentId: string): Promise<AssignmentData[]> {
    try {
      // First get the student's class
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, grade_level, class_section')
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      // Then get assignments for that class
      // Note: This would need to be implemented based on your actual assignments table structure
      console.log('Assignments service called for student:', studentId);
      return [];
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  },

  // Get next due date from fees
  getNextDueDate(fees: FeeData[]): string | null {
    const pendingFees = fees.filter(fee => fee.status === 'pending' || fee.status === 'overdue');
    if (!pendingFees.length) return null;

    const sortedByDate = pendingFees.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    return sortedByDate[0].due_date;
  },

  // Format date for display
  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  },

  // Get attendance status for UI
  getAttendanceStatus(percentage: number): 'excellent' | 'good' | 'needs-improvement' {
    if (percentage >= 95) return 'excellent';
    if (percentage >= 85) return 'good';
    return 'needs-improvement';
  },

  // Convert announcement for UI compatibility
  convertAnnouncementForUI(announcement: AnnouncementData) {
    return {
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      date: this.formatDate(announcement.event_date),
      type: announcement.event_type as 'urgent' | 'info' | 'event',
      isNew: this.isRecent(announcement.created_at)
    };
  },

  // Check if announcement is recent (within last 3 days)
  isRecent(dateString: string): boolean {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    } catch {
      return false;
    }
  }
};