import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, Info, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: string;
  created_at: string;
}

interface AnnouncementCardProps {
  announcements: SchoolEvent[];
  isLoading: boolean;
}

const getAnnouncementIcon = (type: string) => {
  if (type.toLowerCase().includes('urgent') || type.toLowerCase().includes('emergency')) {
    return AlertTriangle;
  } else if (type.toLowerCase().includes('academic') || type.toLowerCase().includes('exam')) {
    return Info;
  } else if (type.toLowerCase().includes('event') || type.toLowerCase().includes('holiday')) {
    return Calendar;
  } else {
    return Bell;
  }
};

const getAnnouncementBadge = (type: string) => {
  if (type.toLowerCase().includes('urgent') || type.toLowerCase().includes('emergency')) {
    return { variant: 'destructive' as const, text: 'Urgent', className: 'bg-destructive text-white' };
  } else if (type.toLowerCase().includes('academic') || type.toLowerCase().includes('exam')) {
    return { variant: 'default' as const, text: 'Academic', className: 'bg-primary text-white' };
  } else if (type.toLowerCase().includes('event') || type.toLowerCase().includes('holiday')) {
    return { variant: 'secondary' as const, text: 'Event', className: 'bg-warning text-white' };
  } else {
    return { variant: 'outline' as const, text: 'General', className: 'bg-muted text-foreground' };
  }
};

export const AnnouncementCard = ({ announcements, isLoading }: AnnouncementCardProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            {t('dashboard.announcements')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-muted rounded"></div>
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
          <Bell className="h-5 w-5 mr-2" />
          {t('dashboard.announcements')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-4">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No announcements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => {
              const IconComponent = getAnnouncementIcon(announcement.event_type);
              const badgeProps = getAnnouncementBadge(announcement.event_type);
              const isNew = new Date(announcement.created_at) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
              
              return (
                <Card key={announcement.id} className="border border-card-border">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-4 w-4 mt-0.5 text-primary" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground">{announcement.title}</h4>
                          <div className="flex items-center space-x-2">
                            {isNew && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                NEW
                              </Badge>
                            )}
                            <Badge {...badgeProps} className={`text-xs ${badgeProps.className}`}>
                              {badgeProps.text}
                            </Badge>
                          </div>
                        </div>
                        {announcement.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {announcement.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(announcement.event_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};