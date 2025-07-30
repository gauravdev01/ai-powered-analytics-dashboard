'use client';

import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

interface BarChartProps {
  data: any[];
  title: string;
  xKey: string;
  yKey: string;
  color?: string;
  gradient?: string;
}

export function BarChart({ 
  data, 
  title, 
  xKey, 
  yKey, 
  color = '#3b82f6',
  gradient = 'from-blue-500/20 to-cyan-500/20'
}: BarChartProps) {
  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey={xKey} 
              stroke="#9ca3af"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
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
            <Bar 
              dataKey={yKey} 
              fill={color}
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}