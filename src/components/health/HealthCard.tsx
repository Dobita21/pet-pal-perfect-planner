
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  status: 'good' | 'warning' | 'critical';
}

interface HealthCardProps {
  metric: HealthMetric;
  onClick: (metric: HealthMetric) => void;
}

const HealthCard = ({ metric, onClick }: HealthCardProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-pet-green/10 text-pet-green border-pet-green/20';
      case 'warning': return 'bg-pet-orange/10 text-pet-primary border-pet-orange/20';
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-pet-primary';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card 
      className="p-4 pet-card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 bg-white rounded-2xl"
      onClick={() => onClick(metric)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-pet-primary">{metric.title}</h3>
        <Badge variant="outline" className={`text-xs rounded-xl ${getStatusColor(metric.status)}`}>
          {metric.status}
        </Badge>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-pet-primary">{metric.value}</span>
            <span className="text-sm text-muted-foreground">{metric.unit}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Updated {metric.lastUpdated}
          </p>
        </div>
        
        <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
          {getTrendIcon(metric.trend)}
        </div>
      </div>
    </Card>
  );
};

export default HealthCard;
