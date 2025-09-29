import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  event_type: string;
}

interface ExamScheduleCardProps {
  events: SchoolEvent[];
  onViewEvent: (eventId: string) => void;
}

export const ExamScheduleCard = ({ events, onViewEvent }: ExamScheduleCardProps): JSX.Element => {
  const { t } = useTranslation();

  // Filter events that are exam-related
  const examEvents = events.filter(event => 
    event.event_type.toLowerCase().includes('exam') || 
    event.event_type.toLowerCase().includes('test')
  );

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          {t('dashboard.examSchedule')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {examEvents.length === 0 ? (
          <div className="text-center py-4">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming exams</p>
          </div>
        ) : (
          <div className="space-y-3">
            {examEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="border border-card-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground text-sm">{event.title}</h4>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {event.event_type}
                  </Badge>
                </div>
                
                {event.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(event.event_date).toLocaleDateString()}
                  </div>
                  {event.start_time && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.start_time}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewEvent(event.id)}
                  className="text-primary hover:text-primary/80 p-1 h-auto w-full"
                >
                  {t('common.viewDetails')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};