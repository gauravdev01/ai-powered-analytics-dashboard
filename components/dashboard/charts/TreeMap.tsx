'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface TreeMapProps {
  data: Array<{
    name: string;
    value: number;
    category?: string;
  }>;
  title: string;
  gradient?: string;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export function TreeMap({ data, title, gradient = 'from-green-500/20 to-teal-500/20' }: TreeMapProps) {
  if (!data.length) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Simple treemap layout algorithm
  const layoutData = data.map((item, index) => ({
    ...item,
    percentage: (item.value / total) * 100,
    color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.value - a.value);

  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80 grid grid-cols-4 gap-1">
        {layoutData.map((item, index) => {
          const size = Math.max(1, Math.floor(item.percentage / 5));
          return (
            <div
              key={item.name}
              className={`rounded-lg flex flex-col justify-center items-center text-center p-2 hover:opacity-80 transition-opacity cursor-pointer group relative`}
              style={{
                backgroundColor: item.color,
                gridColumn: `span ${Math.min(size, 4)}`,
                gridRow: `span ${Math.min(size, 4)}`,
                minHeight: '60px'
              }}
            >
              <div className="text-white font-medium text-xs mb-1 truncate w-full">
                {item.name}
              </div>
              <div className="text-white/80 text-xs">
                {item.value.toLocaleString()}
              </div>
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {item.name}: {item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}