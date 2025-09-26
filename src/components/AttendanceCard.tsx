import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AttendanceRecord {
  id: string;
  student_id: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

interface AttendanceCardProps {
  attendance: AttendanceRecord[];
  isLoading: boolean;
}


const getStatusBadge = (percentage: number, t: any) => {
  if (percentage >= 95) return { variant: 'default' as const, text: t('dashboard.excellent'), className: 'bg-excellent text-white' };
  if (percentage >= 85) return { variant: 'secondary' as const, text: t('dashboard.good'), className: 'bg-good text-white' };
  return { variant: 'destructive' as const, text: t('dashboard.needsImprovement'), className: 'bg-needs-improvement text-white' };
};

export const AttendanceCard = ({ 
  attendance, 
  isLoading 
}: AttendanceCardProps) => {
  const { t } = useTranslation();
  
  // Calculate attendance percentage
  const totalDays = attendance.length;
  const presentDays = attendance.filter(record => 
    record.status === 'present' || record.status === 'half_day'
  ).length;
  const overallPercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
  // Get last attendance date
  const lastRecord = attendance[0];
  const lastUpdated = lastRecord ? new Date(lastRecord.attendance_date).toLocaleDateString() : '';
  
  if (isLoading) {
    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle>{t('dashboard.studentAttendance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{t('dashboard.studentAttendance')}</span>
          {lastUpdated && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {lastUpdated}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Attendance */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('dashboard.overallAttendance')}</p>
            <p className="text-3xl font-bold text-foreground">{overallPercentage}%</p>
          </div>
          <Badge {...getStatusBadge(overallPercentage, t)} className="ml-2">
            {getStatusBadge(overallPercentage, t).text}
          </Badge>
        </div>
        
        {/* Recent Attendance Records */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">{t('dashboard.recentAttendance')}</h4>
          {attendance.slice(0, 5).map((record) => (
            <div key={record.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Date(record.attendance_date).toLocaleDateString()}
              </span>
              <Badge 
                className={
                  record.status === 'present' ? 'bg-excellent text-white' :
                  record.status === 'half_day' ? 'bg-warning text-white' :
                  record.status === 'late' ? 'bg-warning text-white' :
                  'bg-destructive text-white'
                }
              >
                {record.status}
              </Badge>
            </div>
          ))}
          {attendance.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('dashboard.noAttendanceData')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};