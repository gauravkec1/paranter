import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, GraduationCap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface Student {
  id: string;
  full_name: string;
  student_id: string;
  grade_level?: string;
  class_section?: string;
}

interface QuickActionsCardProps {
  students: Student[];
  isLoading: boolean;
}

export const QuickActionsCard = ({ 
  students, 
  isLoading 
}: QuickActionsCardProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {t('dashboard.quickActions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          {t('dashboard.quickActions')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Student Information */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">{t('dashboard.yourChildren')}</p>
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between mb-2 last:mb-0">
              <div>
                <p className="font-medium text-foreground text-sm">{student.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {student.grade_level} {student.class_section}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {student.student_id}
              </Badge>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="h-auto p-3 flex flex-col items-center space-y-1"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs">{t('dashboard.viewMessages')}</span>
          </Button>
          
          <Button
            variant="ghost"
            className="h-auto p-3 flex flex-col items-center space-y-1"
          >
            <GraduationCap className="h-6 w-6" />
            <span className="text-xs">{t('dashboard.viewGrades')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};