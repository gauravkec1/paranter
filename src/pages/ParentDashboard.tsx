import { useState, useEffect, useCallback } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { parentService, StudentProfile, AttendanceData, FeeData, AnnouncementData } from "@/services/parentService";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Users } from "lucide-react";

interface DashboardData {
  students: StudentProfile[];
  selectedStudent: StudentProfile | null;
  attendance: AttendanceData[];
  fees: FeeData[];
  announcements: AnnouncementData[];
  loading: {
    students: boolean;
    attendance: boolean;
    fees: boolean;
    announcements: boolean;
  };
  errors: {
    students?: string;
    attendance?: string;
    fees?: string;
    announcements?: string;
  };
}

const ParentDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState<DashboardData>({
    students: [],
    selectedStudent: null,
    attendance: [],
    fees: [],
    announcements: [],
    loading: {
      students: true,
      attendance: false,
      fees: false,
      announcements: false,
    },
    errors: {}
  });

  // Load students on component mount
  useEffect(() => {
    if (userProfile?.user_id) {
      loadStudents();
      loadAnnouncements();
    }
  }, [userProfile]);

  // Load student-specific data when student is selected
  useEffect(() => {
    if (data.selectedStudent) {
      loadStudentData(data.selectedStudent.id);
    }
  }, [data.selectedStudent]);

  const loadStudents = useCallback(async () => {
    if (!userProfile?.user_id) return;

    try {
      setData(prev => ({ ...prev, loading: { ...prev.loading, students: true }, errors: { ...prev.errors, students: undefined } }));
      
      const students = await parentService.getStudentProfiles(userProfile.user_id);
      
      setData(prev => ({
        ...prev,
        students,
        selectedStudent: students.length > 0 ? students[0] : null,
        loading: { ...prev.loading, students: false }
      }));

      if (students.length === 0) {
        toast.info(t('dashboard.noStudentsFound'));
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setData(prev => ({
        ...prev,
        loading: { ...prev.loading, students: false },
        errors: { ...prev.errors, students: t('dashboard.studentsLoadError') }
      }));
      toast.error(t('dashboard.studentsLoadError'));
    }
  }, [userProfile, t]);

  const loadStudentData = useCallback(async (studentId: string) => {
    try {
      // Load attendance
      setData(prev => ({ ...prev, loading: { ...prev.loading, attendance: true }, errors: { ...prev.errors, attendance: undefined } }));
      const attendance = await parentService.getStudentAttendance(studentId);
      setData(prev => ({ ...prev, attendance, loading: { ...prev.loading, attendance: false } }));

      // Load fees
      setData(prev => ({ ...prev, loading: { ...prev.loading, fees: true }, errors: { ...prev.errors, fees: undefined } }));
      const fees = await parentService.getStudentFees(studentId);
      setData(prev => ({ ...prev, fees, loading: { ...prev.loading, fees: false } }));

    } catch (error) {
      console.error('Error loading student data:', error);
      setData(prev => ({
        ...prev,
        loading: { ...prev.loading, attendance: false, fees: false },
        errors: { 
          ...prev.errors, 
          attendance: t('dashboard.attendanceLoadError'),
          fees: t('dashboard.feesLoadError')
        }
      }));
    }
  }, [t]);

  const loadAnnouncements = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: { ...prev.loading, announcements: true }, errors: { ...prev.errors, announcements: undefined } }));
      const announcements = await parentService.getSchoolAnnouncements(5);
      setData(prev => ({ ...prev, announcements, loading: { ...prev.loading, announcements: false } }));
    } catch (error) {
      console.error('Error loading announcements:', error);
      setData(prev => ({
        ...prev,
        loading: { ...prev.loading, announcements: false },
        errors: { ...prev.errors, announcements: t('dashboard.announcementsLoadError') }
      }));
    }
  }, [t]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      loadStudents(),
      loadAnnouncements(),
      data.selectedStudent ? loadStudentData(data.selectedStudent.id) : Promise.resolve()
    ]);
    toast.success(t('dashboard.dataRefreshed'));
  }, [loadStudents, loadAnnouncements, loadStudentData, data.selectedStudent, t]);

  const handleQuickAction = useCallback((action: string) => {
    toast.success(`${action} ${t('common.initiated')}`, {
      description: t('dashboard.openingInterface', { interface: action.toLowerCase() })
    });
  }, [t]);

  const handlePayFees = useCallback(() => {
    toast.success(t('dashboard.redirectingToPayment'));
  }, [t]);

  const handleViewFeeHistory = useCallback(() => {
    toast.success(t('dashboard.openingFeeHistory'));
  }, [t]);

  const handleViewAssignment = useCallback((assignment: any) => {
    toast.success(t('dashboard.openingAssignment', { title: assignment.title }));
  }, [t]);

  // Calculate derived data
  const attendanceStats = parentService.calculateAttendancePercentage(data.attendance);
  const totalDue = parentService.calculateTotalDue(data.fees);
  const nextDueDate = parentService.getNextDueDate(data.fees);
  const uiAnnouncements = data.announcements.map(ann => parentService.convertAnnouncementForUI(ann));

  // Error component
  const ErrorCard = ({ title, error, onRetry }: { title: string; error: string; onRetry: () => void }) => (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-4 text-center">
        <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
        <h3 className="font-medium text-destructive mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('common.retry')}
        </Button>
      </CardContent>
    </Card>
  );

  // Empty state component
  const EmptyStateCard = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <Card className="border-muted">
      <CardContent className="p-6 text-center">
        <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Student Selection */}
            {data.students.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('dashboard.selectStudent')}:</span>
                    <select 
                      value={data.selectedStudent?.id || ''} 
                      onChange={(e) => {
                        const student = data.students.find(s => s.id === e.target.value);
                        setData(prev => ({ ...prev, selectedStudent: student || null }));
                      }}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {data.students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No students state */}
            {data.students.length === 0 && !data.loading.students && (
              <EmptyStateCard 
                title={t('dashboard.noStudents')}
                description={t('dashboard.noStudentsDescription')}
                icon={Users}
              />
            )}

            {/* Attendance */}
            {data.errors.attendance ? (
              <ErrorCard 
                title={t('dashboard.attendance')}
                error={data.errors.attendance}
                onRetry={() => data.selectedStudent && loadStudentData(data.selectedStudent.id)}
              />
            ) : (
              <AttendanceCard 
                overallPercentage={attendanceStats.overall}
                subjects={[]} // Mock data - would need subject-wise breakdown
                lastUpdated={data.attendance.length > 0 ? parentService.formatDate(data.attendance[0].attendance_date) : t('dashboard.justNow')}
              />
            )}
            
            {/* Mock Grades - would be real data in production */}
            <GradesCard 
              overallGPA={3.8}
              grades={[
                { subject: "Math", grade: "A-", percentage: 92 },
                { subject: "Science", grade: "B+", percentage: 88 },
                { subject: "English", grade: "A", percentage: 95 },
                { subject: "History", grade: "A-", percentage: 91 },
              ]}
              recentExams={[
                { name: "Midterm: Math", percentage: 89 },
                { name: "Final: Science", percentage: 94 },
              ]}
            />
            
            {/* Fees */}
            {data.errors.fees ? (
              <ErrorCard 
                title={t('dashboard.feesDues')}
                error={data.errors.fees}
                onRetry={() => data.selectedStudent && loadStudentData(data.selectedStudent.id)}
              />
            ) : (
              <FeesCard 
                totalDue={totalDue}
                nextDueDate={nextDueDate ? parentService.formatDate(nextDueDate) : ''}
                fees={data.fees.map(fee => ({
                  type: fee.fee_type,
                  amount: fee.amount,
                  dueDate: parentService.formatDate(fee.due_date),
                  status: fee.status === 'partial' ? 'pending' : fee.status as 'pending' | 'paid' | 'overdue'
                }))}
                onPayNow={handlePayFees}
                onViewHistory={handleViewFeeHistory}
              />
            )}
            
            {/* Mock Exam Schedule */}
            <ExamScheduleCard 
              upcomingExams={[
                { subject: "Mathematics", date: "March 20, 2024", time: "10:00 AM", duration: "2 hours", type: "Mid-term" },
                { subject: "Science", date: "March 22, 2024", time: "10:00 AM", duration: "1.5 hours", type: "Unit Test" },
                { subject: "English", date: "March 25, 2024", time: "2:00 PM", duration: "2 hours", type: "Mid-term" }
              ]}
            />
            
            {/* Mock Homework */}
            <HomeworkCard 
              assignments={[
                { subject: "Math", title: "Algebra Problem Set", dueDate: "Feb 20, 2024", status: 'pending' as const, description: "Complete exercises 1-20 from chapter 5" },
                { subject: "Science", title: "Physics Lab Report", dueDate: "Feb 18, 2024", status: 'overdue' as const, description: "Submit the pendulum experiment report" },
                { subject: "English", title: "Essay on Shakespeare", dueDate: "Feb 25, 2024", status: 'completed' as const, description: "Write a 500-word essay on Hamlet" }
              ]}
              onViewAssignment={handleViewAssignment}
            />
            
            {/* Quick Actions */}
            <QuickActionsCard 
              teacherName="Ms. Rodriguez"
              onMessageTeacher={() => handleQuickAction(t('dashboard.messageTeacher'))}
              onCallTeacher={() => handleQuickAction(t('dashboard.callTeacher'))}
              onViewMessages={() => handleQuickAction(t('dashboard.viewMessages'))}
              onViewGrades={() => handleQuickAction(t('dashboard.viewGrades'))}
            />
          </div>
        );
      
      case 'announcements':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{t('dashboard.schoolAnnouncements')}</h2>
              <Button variant="outline" size="sm" onClick={loadAnnouncements} disabled={data.loading.announcements}>
                <RefreshCw className={`h-4 w-4 ${data.loading.announcements ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {data.errors.announcements ? (
              <ErrorCard 
                title={t('dashboard.announcements')}
                error={data.errors.announcements}
                onRetry={loadAnnouncements}
              />
            ) : uiAnnouncements.length > 0 ? (
              <AnnouncementCard announcements={uiAnnouncements} />
            ) : (
              <EmptyStateCard 
                title={t('dashboard.noAnnouncements')}
                description={t('dashboard.noAnnouncementsDescription')}
                icon={AlertCircle}
              />
            )}
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

  if (data.loading.students) {
    return (
      <div className="min-h-screen bg-background-secondary">
        <DashboardHeader notificationCount={3} />
        <main className="p-4 max-w-md mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-secondary pb-20">
      <DashboardHeader 
        notificationCount={uiAnnouncements.filter(a => a.isNew).length}
      />
      
      <main className="p-4 max-w-md mx-auto">
        {renderTabContent()}
      </main>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        messageCount={2}
        notificationCount={uiAnnouncements.filter(a => a.isNew).length}
      />
    </div>
  );
};

export default ParentDashboard;