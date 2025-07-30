'use client';

import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

interface PieChartProps {
  data: any[];
  title: string;
  dataKey: string;
  nameKey: string;
  gradient?: string;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export function PieChart({ 
  data, 
  title, 
  dataKey, 
  nameKey,
  gradient = 'from-purple-500/20 to-pink-500/20'
}: PieChartProps) {
  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}