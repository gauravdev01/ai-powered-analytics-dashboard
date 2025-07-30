'use client';

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';

interface BubbleChartProps {
  data: Array<{
    x: number;
    y: number;
    z: number;
    name: string;
  }>;
  title: string;
  xLabel: string;
  yLabel: string;
  gradient?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function BubbleChart({ 
  data, 
  title, 
  xLabel, 
  yLabel,
  gradient = 'from-cyan-500/20 to-blue-500/20'
}: BubbleChartProps) {
  const maxZ = Math.max(...data.map(d => d.z));
  const minZ = Math.min(...data.map(d => d.z));
  
  const normalizedData = data.map((item, index) => ({
    ...item,
    size: 20 + ((item.z - minZ) / (maxZ - minZ)) * 80, // Size between 20-100
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={normalizedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="x" 
              stroke="#9ca3af"
              fontSize={12}
              name={xLabel}
            />
            <YAxis 
              dataKey="y"
              stroke="#9ca3af" 
              fontSize={12}
              name={yLabel}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
              formatter={(value, name, props) => [
                `${name}: ${value}`,
                props.payload.name
              ]}
            />
            <Scatter dataKey="y">
              {normalizedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  r={entry.size / 5}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}