import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, GraduationCap, Shield, DollarSign, Car, Menu, LogOut } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ProfileManagement } from "@/components/ProfileManagement";
import { useAuth } from "../App";
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  notificationCount?: number;
}

export const DashboardHeader = ({ 
  notificationCount = 0 
}: DashboardHeaderProps) => {
  const { userProfile, signOut } = useAuth();
  
  const handlePortalNavigation = (portal: string) => {
    const routes = {
      teacher: '/teacher',
      admin: '/admin', 
      finance: '/finance',
      driver: '/driver'
    };
    
    if (routes[portal as keyof typeof routes]) {
      window.location.href = routes[portal as keyof typeof routes];
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  if (!userProfile) {
    return null;
  }

  const displayName = userProfile.full_name || userProfile.email;
  const roleLabel = userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1);

  const portalButtons = [
    { key: 'teacher', label: 'Teacher', icon: GraduationCap },
    { key: 'admin', label: 'Admin', icon: Shield },
    { key: 'finance', label: 'Finance', icon: DollarSign },
    { key: 'driver', label: 'Driver', icon: Car }
  ];

  return (
    <header className="bg-gradient-to-r from-primary via-primary to-primary-glow text-primary-foreground p-4 shadow-xl backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-14 w-14 ring-3 ring-primary-foreground/20 ring-offset-2 ring-offset-primary shadow-lg">
            <AvatarImage src={userProfile.avatar_url || "/placeholder-avatar.jpg"} alt={displayName} />
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-bold text-lg">
              {displayName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-xl tracking-tight">{displayName}</h2>
            <p className="text-primary-foreground/90 text-sm font-medium">{roleLabel} Portal</p>
            <Badge variant="secondary" className="mt-1 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
              Active {roleLabel}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          
          {/* Desktop Portal Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {portalButtons.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                onClick={() => handlePortalNavigation(key)}
                className="text-primary-foreground hover:bg-primary-foreground/15 transition-all duration-200 hover:scale-105"
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          {/* Mobile Portal Navigation */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/15"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {portalButtons.map(({ key, label, icon: Icon }) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handlePortalNavigation(key)}
                    className="cursor-pointer"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label} Portal
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <NotificationCenter notificationCount={notificationCount} />
          <ProfileManagement />
        </div>
      </div>
    </header>
  );
};