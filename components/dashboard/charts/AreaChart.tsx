'use client';

import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface AreaChartProps {
  data: any[];
  title: string;
  xKey: string;
  yKey: string;
  color?: string;
  gradient?: string;
}

export function AreaChart({ 
  data, 
  title, 
  xKey, 
  yKey, 
  color = '#f59e0b',
  gradient = 'from-yellow-500/20 to-orange-500/20'
}: AreaChartProps) {
  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey={xKey} 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={yKey} 
              stroke={color}
              fillOpacity={0.3}
              fill={color}
              strokeWidth={2}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}