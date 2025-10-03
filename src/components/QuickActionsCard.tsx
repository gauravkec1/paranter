import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, FileText, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuickActionsCardProps {
  teacherName: string;
  onMessageTeacher: () => void;
  onCallTeacher: () => void;
  onViewMessages: () => void;
  onViewGrades: () => void;
}

export const QuickActionsCard = ({ 
  teacherName, 
  onMessageTeacher, 
  onCallTeacher,
  onViewMessages,
  onViewGrades 
}: QuickActionsCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle>{t('dashboard.quickContact')}</CardTitle>
        <p className="text-sm text-muted-foreground">{teacherName}</p>
        <p className="text-xs text-muted-foreground">{t('dashboard.directlyMessageOrCall')}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary/10 hover:text-primary border-primary/20"
            onClick={onMessageTeacher}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t('dashboard.message')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary/10 hover:text-primary border-primary/20"
            onClick={onCallTeacher}
          >
            <Phone className="h-4 w-4 mr-2" />
            {t('dashboard.call')}
          </Button>
        </div>
        
        <div className="pt-2 border-t border-card-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">{t('dashboard.quickActions')}</h4>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-primary hover:bg-primary/10"
              onClick={onViewMessages}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('dashboard.viewMessages')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-primary hover:bg-primary/10"
              onClick={onViewGrades}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              {t('dashboard.viewGrades')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};