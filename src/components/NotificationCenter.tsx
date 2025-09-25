import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Calendar,
  DollarSign,
  GraduationCap,
  Clock,
  X,
  CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'message' | 'alert' | 'success' | 'info' | 'event' | 'payment' | 'academic';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Fee Payment Due',
    description: 'Your monthly fee payment is due in 2 days. Please make the payment to avoid late charges.',
    time: '2 hours ago',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message from Ms. Rodriguez',
    description: 'Parent-teacher meeting scheduled for next week. Please confirm your availability.',
    time: '4 hours ago',
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'success',
    title: 'Assignment Submitted',
    description: 'Math homework has been successfully submitted and is under review.',
    time: '1 day ago',
    read: true,
    priority: 'low'
  },
  {
    id: '4',
    type: 'event',
    title: 'Sports Day Event',
    description: 'Annual sports day is scheduled for March 25th. Registration is now open.',
    time: '2 days ago',
    read: false,
    priority: 'medium'
  },
  {
    id: '5',
    type: 'academic',
    title: 'Grade Published',
    description: 'Your Science test grades are now available. Check your academic portal.',
    time: '3 days ago',
    read: true,
    priority: 'medium'
  }
];

interface NotificationCenterProps {
  notificationCount?: number;
}

export const NotificationCenter = ({ notificationCount = 0 }: NotificationCenterProps) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'academic':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'alert':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'success':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'info':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'event':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'payment':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'academic':
        return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification deleted');
  };

  const filterNotifications = (type: string) => {
    if (type === 'all') return notifications;
    if (type === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative shadow-sm hover:shadow-md transition-shadow">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 notification-badge">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-br from-background to-background-secondary">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl text-foreground">
              {t('common.notifications')}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          <SheetDescription>
            Stay updated with important school notifications and messages
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="all" className="text-xs">
                All
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="message" className="text-xs">Messages</TabsTrigger>
              <TabsTrigger value="alert" className="text-xs">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filterNotifications(activeTab).map((notification) => (
                    <div
                      key={notification.id}
                      className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                        notification.read 
                          ? 'bg-muted/30 border-border/50' 
                          : 'bg-card border-primary/20 shadow-sm'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className={`text-sm mt-1 ${notification.read ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                            {notification.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{notification.time}</span>
                            </div>
                            <Badge 
                              variant={notification.priority === 'high' ? 'destructive' : 
                                     notification.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filterNotifications(activeTab).length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No notifications found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};