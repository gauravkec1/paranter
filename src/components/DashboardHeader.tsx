import { Bell, User, GraduationCap, Shield, Wallet, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface DashboardHeaderProps {
  studentName: string;
  parentName: string;
  notificationCount?: number;
}

export const DashboardHeader = ({ 
  studentName, 
  parentName, 
  notificationCount = 0 
}: DashboardHeaderProps) => {
  const { t } = useTranslation();
  return (
    <header className="bg-card border-b border-card-border sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/api/placeholder/40/40" alt={parentName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {parentName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t('common.dashboard')}</h2>
            <p className="text-sm text-muted-foreground">{studentName}'s Progress</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <Link to="/teacher">
            <Button variant="outline" size="sm">
              <GraduationCap className="h-4 w-4 mr-2" />
              {t('navigation.teacher')}
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="text-success border-success hover:bg-success hover:text-success-foreground">
              <Shield className="h-4 w-4 mr-2" />
              {t('navigation.admin')}
            </Button>
          </Link>
          <Link to="/finance">
            <Button variant="outline" size="sm" className="text-warning border-warning hover:bg-warning hover:text-warning-foreground">
              <Wallet className="h-4 w-4 mr-2" />
              {t('navigation.finance')}
            </Button>
          </Link>
          <Link to="/driver">
            <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
              <Bus className="h-4 w-4 mr-2" />
              {t('navigation.driver')}
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs notification-badge"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};