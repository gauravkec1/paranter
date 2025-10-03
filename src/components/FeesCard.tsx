import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ExternalLink, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Fee {
  type: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface FeesCardProps {
  totalDue: number;
  nextDueDate: string;
  fees: Fee[];
  onPayNow: () => void;
  onViewHistory: () => void;
}

const getStatusColor = (status: Fee['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-excellent text-white';
    case 'pending':
      return 'bg-warning text-white';
    case 'overdue':
      return 'bg-destructive text-white';
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
    default:
      return status;
  }
};

export const FeesCard = ({ 
  totalDue, 
  nextDueDate, 
  fees, 
  onPayNow, 
  onViewHistory 
}: FeesCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{t('dashboard.feesDues')}</span>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={onViewHistory}>
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
            <Button 
              onClick={onPayNow}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
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
          {fees.map((fee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{fee.type}</span>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.dueDate')}: {fee.dueDate}
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
        </div>
      </CardContent>
    </Card>
  );
};