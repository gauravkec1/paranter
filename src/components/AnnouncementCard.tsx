import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, Info } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'urgent' | 'info' | 'event';
  isNew?: boolean;
}

interface AnnouncementCardProps {
  announcements: Announcement[];
}

const getAnnouncementIcon = (type: Announcement['type']) => {
  switch (type) {
    case 'urgent':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'event':
      return <Calendar className="h-4 w-4 text-primary" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

const getAnnouncementBadge = (type: Announcement['type']) => {
  switch (type) {
    case 'urgent':
      return { variant: 'destructive' as const, text: 'Urgent' };
    case 'event':
      return { variant: 'default' as const, text: 'Event', className: 'bg-primary text-primary-foreground' };
    default:
      return { variant: 'secondary' as const, text: 'Info' };
  }
};

export const AnnouncementCard = ({ announcements }: AnnouncementCardProps) => {
  return (
    <div className="space-y-3">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getAnnouncementIcon(announcement.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {announcement.title}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    {announcement.isNew && (
                      <Badge variant="outline" className="text-xs notification-badge">
                        NEW
                      </Badge>
                    )}
                    <Badge {...getAnnouncementBadge(announcement.type)} className="text-xs">
                      {getAnnouncementBadge(announcement.type).text}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {announcement.description}
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {announcement.date}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};