import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp } from "lucide-react";

interface Grade {
  subject: string;
  grade: string;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
}

interface RecentExam {
  name: string;
  percentage: number;
}

interface GradesCardProps {
  overallGPA: number;
  grades: Grade[];
  recentExams: RecentExam[];
}

const getGradeColor = (grade: string) => {
  switch (grade.charAt(0)) {
    case 'A':
      return 'bg-excellent text-white';
    case 'B':
      return 'bg-good text-white';
    case 'C':
      return 'bg-warning text-white';
    default:
      return 'bg-needs-improvement text-white';
  }
};

export const GradesCard = ({ overallGPA, grades, recentExams }: GradesCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Grades & Academic Performance</span>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <span className="text-sm">View Progress Reports</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall GPA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Overall GPA</p>
            <p className="text-3xl font-bold text-foreground">{overallGPA}</p>
          </div>
          <div className="flex items-center text-excellent">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Improving</span>
          </div>
        </div>
        
        {/* Subject Grades */}
        <div className="space-y-3">
          {grades.map((grade, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{grade.subject}</span>
              <div className="flex items-center space-x-2">
                <Badge className={getGradeColor(grade.grade)}>
                  {grade.grade}
                </Badge>
                <span className="text-sm font-semibold text-foreground w-12 text-right">
                  {grade.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Recent Exam Scores */}
        <div className="pt-2 border-t border-card-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">Recent Exam Scores</h4>
          <div className="space-y-2">
            {recentExams.map((exam, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{exam.name}</span>
                <span className="text-sm font-semibold text-foreground">{exam.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};