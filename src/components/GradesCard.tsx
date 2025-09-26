import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  total_marks?: number;
  assignment_submissions?: Array<{
    id: string;
    student_id: string;
    marks_obtained?: number;
    submitted_at?: string;
  }>;
}

interface GradesCardProps {
  assignments: Assignment[];
  isLoading: boolean;
}

const getGradeColor = (grade: string) => {
  switch (grade.charAt(0)) {
    case 'A':
      return 'bg-excellent text-white';
    case 'B':
      return 'bg-good text-white';
    case 'C':
      return 'bg-warning text-white';
    default:
      return 'bg-needs-improvement text-white';
  }
};

export const GradesCard = ({ assignments, isLoading }: GradesCardProps) => {
  const { t } = useTranslation();
  
  // Calculate grades from assignments
  const gradedAssignments = assignments.filter(a => 
    a.assignment_submissions && 
    a.assignment_submissions.length > 0 && 
    a.assignment_submissions[0].marks_obtained !== null
  );
  
  const totalMarks = gradedAssignments.reduce((sum, a) => sum + (a.total_marks || 0), 0);
  const obtainedMarks = gradedAssignments.reduce((sum, a) => {
    const submission = a.assignment_submissions?.[0];
    return sum + (submission?.marks_obtained || 0);
  }, 0);
  
  const overallPercentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  
  if (isLoading) {
    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle>{t('dashboard.gradesAcademic')}</CardTitle>
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
          <span>{t('dashboard.gradesAcademic')}</span>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <span className="text-sm">{t('dashboard.viewProgressReports')}</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Performance */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('dashboard.overallGrade')}</p>
            <p className="text-3xl font-bold text-foreground">{overallPercentage}%</p>
          </div>
          <div className="flex items-center text-excellent">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{gradedAssignments.length} graded</span>
          </div>
        </div>
        
        {/* Recent Assignments */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">{t('dashboard.recentAssignments')}</h4>
          {gradedAssignments.slice(0, 4).map((assignment) => {
            const submission = assignment.assignment_submissions?.[0];
            const percentage = assignment.total_marks > 0 
              ? Math.round(((submission?.marks_obtained || 0) / assignment.total_marks) * 100)
              : 0;
            
            return (
              <div key={assignment.id} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">{assignment.subject}</span>
                  <p className="text-xs text-muted-foreground">{assignment.title}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getGradeColor(percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : 'D')}>
                    {percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : 'D'}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
          {gradedAssignments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('dashboard.noGradesAvailable')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};