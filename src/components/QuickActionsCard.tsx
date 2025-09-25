import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, FileText, GraduationCap } from "lucide-react";

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
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle>Quick Contact</CardTitle>
        <p className="text-sm text-muted-foreground">{teacherName}</p>
        <p className="text-xs text-muted-foreground">Directly message or call</p>
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
            Message
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-primary/10 hover:text-primary border-primary/20"
            onClick={onCallTeacher}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
        </div>
        
        <div className="pt-2 border-t border-card-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-primary hover:bg-primary/10"
              onClick={onViewMessages}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              View Messages
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-primary hover:bg-primary/10"
              onClick={onViewGrades}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              View Grades
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};