import React, { Suspense } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AttendanceCard } from '@/components/AttendanceCard';
import { GradesCard } from '@/components/GradesCard';
import { FeesCard } from '@/components/FeesCard';
import { HomeworkCard } from '@/components/HomeworkCard';
import { ExamScheduleCard } from '@/components/ExamScheduleCard';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { QuickActionsCard } from '@/components/QuickActionsCard';
import { useAuth } from '@/hooks/useAuth';
import { useParentDashboard } from '@/hooks/useParentDashboard';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { performanceMonitor } from '@/lib/performance';

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-20 bg-primary"></div>
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Dashboard Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.retry')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const ParentDashboard = () => {
  console.log('ParentDashboard: Component rendering started');
  const { userProfile, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  console.log('ParentDashboard: Auth state - userProfile:', !!userProfile, 'authLoading:', authLoading);
  
  const {
    students,
    attendance,
    fees,
    assignments,
    events,
    messages,
    isLoading: dataLoading,
    error
  } = useParentDashboard(userProfile?.user_id || null);

  console.log('ParentDashboard: Data state - students:', students?.length, 'dataLoading:', dataLoading, 'error:', error);

  // Performance monitoring
  React.useEffect(() => {
    if (!authLoading && !dataLoading) {
      // Start performance mark first time component loads
      performanceMonitor.markStart('dashboard-ready');
      performanceMonitor.markEnd('dashboard-ready');
    }
  }, [authLoading, dataLoading]);

  const handleRefresh = () => {
    toast.success(t('dashboard.dataRefreshed'));
    window.location.reload();
  };

  const handleViewAssignment = (assignmentId: string) => {
    toast.info(`Opening assignment: ${assignmentId}`);
  };

  const handleViewEvent = (eventId: string) => {
    toast.info(`Opening event: ${eventId}`);
  };

  // Loading states
  if (authLoading) {
    return <DashboardSkeleton />;
  }

  // Error states
  if (error) {
    return <ErrorFallback error={error} onRetry={handleRefresh} />;
  }

  // No students found
  if (!dataLoading && students.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader notificationCount={messages.filter(m => !m.is_read).length} />
        
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('dashboard.noStudents')}</h2>
              <p className="text-muted-foreground mb-4">{t('dashboard.noStudentsDescription')}</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('common.refresh')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  console.log('ParentDashboard: About to render main component');
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader notificationCount={messages.filter(m => !m.is_read).length} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t('welcome.title')}
          </h1>
          <p className="text-muted-foreground">
            Monitor your child's academic progress and stay connected with their education
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1: Key Metrics */}
          <Suspense fallback={<Skeleton className="h-64" />}>
            <AttendanceCard 
              attendance={attendance}
              isLoading={dataLoading}
            />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-64" />}>
            <GradesCard 
              assignments={assignments}
              isLoading={dataLoading}
            />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-64" />}>
            <FeesCard 
              fees={fees}
              isLoading={dataLoading}
            />
          </Suspense>

          {/* Row 2: Activities */}
          <Suspense fallback={<Skeleton className="h-64" />}>
            <HomeworkCard 
              assignments={assignments}
              students={students}
              onViewAssignment={handleViewAssignment}
            />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-64" />}>
            <ExamScheduleCard 
              events={events}
              onViewEvent={handleViewEvent}
            />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-64" />}>
            <AnnouncementCard 
              announcements={events}
              isLoading={dataLoading}
            />
          </Suspense>

          {/* Row 3: Communications */}
          <div className="md:col-span-2 lg:col-span-3">
            <Suspense fallback={<Skeleton className="h-32" />}>
              <QuickActionsCard 
                students={students}
                isLoading={dataLoading}
              />
            </Suspense>
          </div>
        </div>

        {/* Footer with Performance Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center text-xs text-muted-foreground">
            Dashboard loaded • {students.length} students • {attendance.length} attendance records • {assignments.length} assignments
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;