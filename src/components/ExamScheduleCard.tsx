import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Exam {
  subject: string;
  date: string;
  time: string;
  duration: string;
  type: string;
}

interface ExamScheduleCardProps {
  upcomingExams: Exam[];
}

export const ExamScheduleCard = ({ upcomingExams }: ExamScheduleCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          {t('dashboard.examSchedule')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('dashboard.upcomingExams')}</p>
        
        {upcomingExams.length === 0 ? (
          <div className="text-center py-4">
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t('dashboard.noUpcomingExams')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingExams.map((exam, index) => (
              <div key={index} className="border border-card-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{exam.subject}</h4>
                  <Badge variant="outline" className="text-xs">
                    {exam.type}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {exam.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {exam.time}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Duration: {exam.duration}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};