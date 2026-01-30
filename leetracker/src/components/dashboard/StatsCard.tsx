import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const StatsCard = ({ title, value, icon, subtitle, variant = 'default' }: StatsCardProps) => {
  const getBgClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/10';
      case 'success':
        return 'bg-chart-1/10';
      case 'warning':
        return 'bg-chart-3/10';
      default:
        return 'bg-card';
    }
  };

  return (
    <Card className={`${getBgClass()} border-border/50`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
