import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ProfileManagement } from "@/components/ProfileManagement";
import { useAuth } from "../App";
import { useTranslation } from "react-i18next";
import paranteLogo from "@/assets/paranter-logo.png";

interface DashboardHeaderProps {
  notificationCount?: number;
}

export const DashboardHeader = ({ 
  notificationCount = 0 
}: DashboardHeaderProps) => {
  const { userProfile } = useAuth();
  const { t } = useTranslation();

  if (!userProfile) {
    return null;
  }

  const displayName = userProfile.full_name || userProfile.email;
  const roleKey = `roles.${userProfile.role}` as const;
  const roleLabel = t(roleKey);

  return (
    <header className="bg-gradient-to-r from-primary via-primary to-primary-glow text-primary-foreground p-4 shadow-xl backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img src={paranteLogo} alt="Paranter Logo" className="h-10 w-10" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-primary-foreground">Paranter</h3>
              <p className="text-xs text-primary-foreground/80">Management System</p>
            </div>
          </div>
          <Avatar className="h-14 w-14 ring-3 ring-primary-foreground/20 ring-offset-2 ring-offset-primary shadow-lg">
            <AvatarImage src={userProfile.avatar_url || "/placeholder-avatar.jpg"} alt={displayName} />
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-bold text-lg">
              {displayName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-xl tracking-tight">{displayName}</h2>
            <p className="text-primary-foreground/90 text-sm font-medium">{roleLabel}</p>
            <Badge variant="secondary" className="mt-1 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20">
              {t('dashboard.activeStatus')} {roleLabel}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          <NotificationCenter notificationCount={notificationCount} />
          <ProfileManagement />
        </div>
      </div>
    </header>
  );
};