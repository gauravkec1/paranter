import { Home, Bell, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  messageCount?: number;
  notificationCount?: number;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNavigation = ({ 
  activeTab, 
  onTabChange, 
  messageCount = 0,
  notificationCount = 0 
}: BottomNavigationProps) => {
  const getBadgeCount = (id: string) => {
    switch (id) {
      case 'messages':
        return messageCount;
      case 'announcements':
        return notificationCount;
      default:
        return 0;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeCount = getBadgeCount(item.id);
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`relative flex-col h-12 px-3 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {badgeCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs notification-badge"
                  >
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};