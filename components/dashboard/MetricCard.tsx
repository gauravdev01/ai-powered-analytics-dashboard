'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon,
  gradient = 'from-blue-500/20 to-purple-500/20'
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return 'text-gray-400';
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <Card className={`relative p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">
            {title}
          </h3>
          {icon && (
            <div className="text-white/80 group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white mb-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>
                  {Math.abs(change)}% {changeLabel || 'vs last period'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
    </Card>
  );
}