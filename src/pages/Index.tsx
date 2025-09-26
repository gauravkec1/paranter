import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AttendanceCard } from "@/components/AttendanceCard";
import { GradesCard } from "@/components/GradesCard";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { QuickActionsCard } from "@/components/QuickActionsCard";
import { FeesCard } from "@/components/FeesCard";
import { ExamScheduleCard } from "@/components/ExamScheduleCard";
import { HomeworkCard } from "@/components/HomeworkCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { toast } from "sonner";

// Mock data for demonstration
const studentData = {
  studentName: "Emily Johnson",
  parentName: "Sarah Johnson",
  attendance: {
    overall: 95,
    subjects: [
      { name: "Math", percentage: 100, status: 'excellent' as const },
      { name: "Science", percentage: 80, status: 'good' as const, absences: 1, lastAbsence: "Feb 15" },
      { name: "English", percentage: 98, status: 'excellent' as const },
      { name: "History", percentage: 92, status: 'excellent' as const },
    ],
    lastUpdated: "Just now"
  },
  grades: {
    gpa: 3.8,
    subjects: [
      { subject: "Math", grade: "A-", percentage: 92 },
      { subject: "Science", grade: "B+", percentage: 88 },
      { subject: "English", grade: "A", percentage: 95 },
      { subject: "History", grade: "A-", percentage: 91 },
    ],
    recentExams: [
      { name: "Midterm: Math", percentage: 89 },
      { name: "Final: Science", percentage: 94 },
    ]
  },
  announcements: [
    {
      id: "1",
      title: "School Closure",
      description: "Due to inclement weather, school will be closed on Monday, February 18th.",
      date: "February 16, 2024",
      type: 'urgent' as const,
      isNew: true
    },
    {
      id: "2", 
      title: "Parent-Teacher Conference",
      description: "Sign up for your parent-teacher conference slots. Available dates: March 1-5.",
      date: "February 14, 2024",
      type: 'event' as const
    },
    {
      id: "3",
      title: "Science Fair Reminder", 
      description: "Don't forget to submit your science fair projects by February 28th.",
      date: "February 12, 2024",
      type: 'info' as const
    }
  ],
  teacher: "Ms. Rodriguez",
  fees: {
    totalDue: 15000,
    nextDueDate: "March 15, 2024",
    breakdown: [
      { type: "Tuition Fee", amount: 10000, dueDate: "March 15, 2024", status: 'pending' as const },
      { type: "Bus Fee", amount: 3000, dueDate: "March 10, 2024", status: 'pending' as const },
      { type: "Activity Fee", amount: 2000, dueDate: "March 1, 2024", status: 'paid' as const }
    ]
  },
  exams: [
    { subject: "Mathematics", date: "March 20, 2024", time: "10:00 AM", duration: "2 hours", type: "Mid-term" },
    { subject: "Science", date: "March 22, 2024", time: "10:00 AM", duration: "1.5 hours", type: "Unit Test" },
    { subject: "English", date: "March 25, 2024", time: "2:00 PM", duration: "2 hours", type: "Mid-term" }
  ],
  assignments: [
    { subject: "Math", title: "Algebra Problem Set", dueDate: "Feb 20, 2024", status: 'pending' as const, description: "Complete exercises 1-20 from chapter 5" },
    { subject: "Science", title: "Physics Lab Report", dueDate: "Feb 18, 2024", status: 'overdue' as const, description: "Submit the pendulum experiment report" },
    { subject: "English", title: "Essay on Shakespeare", dueDate: "Feb 25, 2024", status: 'completed' as const, description: "Write a 500-word essay on Hamlet" },
    { subject: "History", title: "World War II Timeline", dueDate: "Feb 22, 2024", status: 'pending' as const, description: "Create a detailed timeline of major events" }
  ]
};

const Index = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');

  const handleQuickAction = (action: string) => {
    toast.success(`${action} initiated`, {
      description: `Opening ${action.toLowerCase()} interface...`
    });
  };

  const handlePayFees = () => {
    toast.success("Redirecting to payment portal...");
  };

  const handleViewFeeHistory = () => {
    toast.success("Opening fee history...");
  };

  const handleViewAssignment = (assignment: any) => {
    toast.success(`Opening ${assignment.title}...`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <AttendanceCard 
              attendance={[
                { id: '1', student_id: 'demo-student', attendance_date: '2024-01-15', status: 'present', notes: '' },
                { id: '2', student_id: 'demo-student', attendance_date: '2024-01-14', status: 'present', notes: '' },
                { id: '3', student_id: 'demo-student', attendance_date: '2024-01-13', status: 'late', notes: '' },
                { id: '4', student_id: 'demo-student', attendance_date: '2024-01-12', status: 'present', notes: '' },
                { id: '5', student_id: 'demo-student', attendance_date: '2024-01-11', status: 'absent', notes: 'Sick' }
              ]}
              isLoading={false}
            />
            
            <GradesCard 
              assignments={[
                { 
                  id: '1', 
                  title: 'Math Quiz 1', 
                  subject: 'Mathematics', 
                  due_date: '2024-01-10', 
                  total_marks: 100,
                  assignment_submissions: [{ id: '1', student_id: 'demo-student', marks_obtained: 85, submitted_at: '2024-01-09' }]
                },
                { 
                  id: '2', 
                  title: 'Science Lab Report', 
                  subject: 'Science', 
                  due_date: '2024-01-08', 
                  total_marks: 50,
                  assignment_submissions: [{ id: '2', student_id: 'demo-student', marks_obtained: 42, submitted_at: '2024-01-07' }]
                }
              ]}
              isLoading={false}
            />
            
            <FeesCard 
              fees={[
                { id: '1', fee_type: 'Tuition Fee', amount: 5000, due_date: '2024-02-01', status: 'pending', student_id: 'demo-student' },
                { id: '2', fee_type: 'Transport Fee', amount: 1500, due_date: '2024-01-15', status: 'paid', student_id: 'demo-student', paid_date: '2024-01-10' }
              ]}
              isLoading={false}
            />
            
            <ExamScheduleCard 
              events={[
                { id: '1', title: 'Math Final Exam', event_date: '2024-02-15', start_time: '09:00', event_type: 'exam', description: 'Final mathematics examination' },
                { id: '2', title: 'Science Test', event_date: '2024-02-20', start_time: '14:00', event_type: 'test', description: 'Chapter 5-7 test' }
              ]}
              onViewEvent={(id) => console.log('View event:', id)}
            />
            
            <HomeworkCard 
              assignments={[
                { id: '1', title: 'Math Homework Ch. 5', subject: 'Mathematics', due_date: '2024-01-25', description: 'Complete exercises 1-20' },
                { id: '2', title: 'English Essay', subject: 'English', due_date: '2024-01-22', description: 'Write a 500-word essay on climate change' },
                { id: '3', title: 'Science Project', subject: 'Science', due_date: '2024-01-18', description: 'Solar system model creation' }
              ]}
              students={[{ id: 'demo-student', full_name: 'Demo Student', student_id: 'STU001' }]}
              onViewAssignment={(id) => console.log('View assignment:', id)}
            />
            
            <QuickActionsCard 
              students={[{ id: 'demo-student', full_name: 'Demo Student', student_id: 'STU001', grade_level: '10th', class_section: 'A' }]}
              isLoading={false}
            />
          </div>
        );
      
      case 'announcements':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">{t('dashboard.schoolAnnouncements')}</h2>
            <AnnouncementCard 
              announcements={[
                { id: '1', title: 'School Holiday', description: 'School will be closed tomorrow', event_date: '2024-01-20', event_type: 'holiday', created_at: '2024-01-15' },
                { id: '2', title: 'Parent-Teacher Meeting', description: 'Monthly meeting scheduled', event_date: '2024-01-25', event_type: 'event', created_at: '2024-01-10' },
                { id: '3', title: 'Exam Schedule Released', description: 'Final exam dates announced', event_date: '2024-01-18', event_type: 'academic', created_at: '2024-01-16' }
              ]} 
              isLoading={false}
            />
          </div>
        );
      
      case 'messages':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">{t('dashboard.messages')}</h2>
              <p className="text-muted-foreground">{t('dashboard.comingSoon')} - {t('dashboard.directMessaging')}</p>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">{t('dashboard.profile')}</h2>
              <p className="text-muted-foreground">{t('dashboard.profileManagement')}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      <DashboardHeader 
        notificationCount={3}
      />
      
      <main className="p-4 max-w-md mx-auto">
        {renderTabContent()}
      </main>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        messageCount={2}
        notificationCount={1}
      />
    </div>
  );
};

export default Index;
