import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AttendanceCard } from "@/components/AttendanceCard";
import { GradesCard } from "@/components/GradesCard";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { QuickActionsCard } from "@/components/QuickActionsCard";
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
  teacher: "Ms. Rodriguez"
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleQuickAction = (action: string) => {
    toast.success(`${action} initiated`, {
      description: `Opening ${action.toLowerCase()} interface...`
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <AttendanceCard 
              overallPercentage={studentData.attendance.overall}
              subjects={studentData.attendance.subjects}
              lastUpdated={studentData.attendance.lastUpdated}
            />
            
            <GradesCard 
              overallGPA={studentData.grades.gpa}
              grades={studentData.grades.subjects}
              recentExams={studentData.grades.recentExams}
            />
            
            <QuickActionsCard 
              teacherName={studentData.teacher}
              onMessageTeacher={() => handleQuickAction('Message Teacher')}
              onCallTeacher={() => handleQuickAction('Call Teacher')}
              onViewMessages={() => handleQuickAction('View Messages')}
              onViewGrades={() => handleQuickAction('View Grades')}
            />
          </div>
        );
      
      case 'announcements':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">School Announcements</h2>
            <AnnouncementCard announcements={studentData.announcements} />
          </div>
        );
      
      case 'messages':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Messages</h2>
              <p className="text-muted-foreground">Coming soon - Direct messaging with teachers</p>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Profile</h2>
              <p className="text-muted-foreground">Student & parent profile management</p>
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
        studentName={studentData.studentName}
        parentName={studentData.parentName}
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
