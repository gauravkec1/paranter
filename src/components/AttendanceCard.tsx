import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Subject {
  name: string;
  percentage: number;
  status: 'excellent' | 'good' | 'needs-improvement';
  absences?: number;
  lastAbsence?: string;
}

interface AttendanceCardProps {
  overallPercentage: number;
  subjects: Subject[];
  lastUpdated: string;
}

const getStatusColor = (status: Subject['status']) => {
  switch (status) {
    case 'excellent':
      return 'bg-excellent';
    case 'good':
      return 'bg-good';
    case 'needs-improvement':
      return 'bg-needs-improvement';
    default:
      return 'bg-muted';
  }
};

const getStatusBadge = (percentage: number, t: any) => {
  if (percentage >= 95) return { variant: 'default' as const, text: t('dashboard.excellent'), className: 'bg-excellent text-white' };
  if (percentage >= 85) return { variant: 'secondary' as const, text: t('dashboard.good'), className: 'bg-good text-white' };
  return { variant: 'destructive' as const, text: t('dashboard.needsImprovement'), className: 'bg-needs-improvement text-white' };
};

export const AttendanceCard = ({ 
  overallPercentage, 
  subjects, 
  lastUpdated 
}: AttendanceCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{t('dashboard.studentAttendance')}</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {lastUpdated === 'Just now' ? t('dashboard.justNow') : lastUpdated}
          </div>
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
        
        {/* Subject-wise Attendance */}
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{subject.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-foreground">{subject.percentage}%</span>
                  {subject.absences && subject.absences > 0 && (
                    <div className="flex items-center text-warning">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span className="text-xs">
                        {subject.absences} {subject.absences > 1 ? t('dashboard.absences') : t('dashboard.absence')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Progress 
                value={subject.percentage} 
                className="h-2"
                style={{
                  background: 'hsl(var(--muted))'
                }}
              />
              {subject.lastAbsence && (
                <p className="text-xs text-warning">
                  {t('dashboard.lastAbsence')}: {subject.lastAbsence}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};