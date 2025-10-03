import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Assignment {
  subject: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  description?: string;
}

interface HomeworkCardProps {
  assignments: Assignment[];
  onViewAssignment: (assignment: Assignment) => void;
}

const getStatusIcon = (status: Assignment['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-excellent" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'overdue':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: Assignment['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-excellent text-white';
    case 'pending':
      return 'bg-warning text-white';
    case 'overdue':
      return 'bg-destructive text-white';
    default:
      return 'bg-muted text-foreground';
  }
};

const getStatusText = (status: Assignment['status'], t: any) => {
  switch (status) {
    case 'completed':
      return t('dashboard.completed');
    case 'pending':
      return t('dashboard.pending');
    case 'overdue':
      return t('dashboard.overdue');
    default:
      return status;
  }
};

export const HomeworkCard = ({ assignments, onViewAssignment }: HomeworkCardProps) => {
  const { t } = useTranslation();
  const pendingCount = assignments.filter(a => a.status !== 'completed').length;

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            {t('dashboard.homework')}
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {t('dashboard.pendingTasks')}: {pendingCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-4">
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No assignments available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.slice(0, 3).map((assignment, index) => (
              <div key={index} className="border border-card-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(assignment.status)}
                    <h4 className="font-medium text-foreground text-sm">{assignment.subject}</h4>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>
                    {getStatusText(assignment.status, t)}
                  </Badge>
                </div>
                
                <p className="text-sm text-foreground font-medium">{assignment.title}</p>
                
                {assignment.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {assignment.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {t('dashboard.dueDate')}: {assignment.dueDate}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewAssignment(assignment)}
                    className="text-primary hover:text-primary/80 p-1 h-auto"
                  >
                    {t('common.viewDetails')}
                  </Button>
                </div>
              </div>
            ))}
            
            {assignments.length > 3 && (
              <Button variant="outline" className="w-full mt-3">
                View All Assignments ({assignments.length})
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};