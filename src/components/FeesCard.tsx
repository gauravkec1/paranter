import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ExternalLink, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Fee {
  id: string;
  fee_type: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  student_id: string;
  paid_date?: string;
  description?: string;
}

interface FeesCardProps {
  fees: Fee[];
  isLoading: boolean;
}

const getStatusColor = (status: Fee['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-excellent text-white';
    case 'pending':
      return 'bg-warning text-white';
    case 'overdue':
      return 'bg-destructive text-white';
    case 'partial':
      return 'bg-warning text-white';
    default:
      return 'bg-muted text-foreground';
  }
};

const getStatusText = (status: Fee['status'], t: any) => {
  switch (status) {
    case 'paid':
      return t('dashboard.completed');
    case 'pending':
      return t('dashboard.pending');
    case 'overdue':
      return t('dashboard.overdue');
    case 'partial':
      return t('dashboard.partial');
    default:
      return status;
  }
};

export const FeesCard = ({ 
  fees, 
  isLoading 
}: FeesCardProps) => {
  const { t } = useTranslation();
  
  // Calculate total due amount
  const totalDue = fees
    .filter(fee => fee.status === 'pending' || fee.status === 'overdue' || fee.status === 'partial')
    .reduce((sum, fee) => sum + fee.amount, 0);
  
  // Get next due date
  const pendingFees = fees.filter(fee => fee.status === 'pending' || fee.status === 'overdue');
  const nextDueDate = pendingFees.length > 0 
    ? new Date(Math.min(...pendingFees.map(fee => new Date(fee.due_date).getTime()))).toLocaleDateString()
    : null;

  if (isLoading) {
    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle>{t('dashboard.feesDues')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{t('dashboard.feesDues')}</span>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <span className="text-sm">{t('dashboard.viewFeeHistory')}</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Total Due Amount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('dashboard.totalDue')}</p>
            <p className="text-3xl font-bold text-foreground">₹{totalDue.toLocaleString()}</p>
          </div>
          {totalDue > 0 && (
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('dashboard.payNow')}
            </Button>
          )}
        </div>
        
        {/* Next Due Date */}
        {nextDueDate && (
          <div className="flex items-center text-warning">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {t('dashboard.nextDueDate')}: {nextDueDate}
            </span>
          </div>
        )}
        
        {/* Fee Breakdown */}
        <div className="space-y-3">
          {fees.slice(0, 4).map((fee) => (
            <div key={fee.id} className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{fee.fee_type}</span>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.dueDate')}: {new Date(fee.due_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-foreground">
                  ₹{fee.amount.toLocaleString()}
                </span>
                <Badge className={getStatusColor(fee.status)}>
                  {getStatusText(fee.status, t)}
                </Badge>
              </div>
            </div>
          ))}
          {fees.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t('dashboard.noFeesData')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};