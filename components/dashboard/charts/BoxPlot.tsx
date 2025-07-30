'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

interface BoxPlotProps {
  data: Array<{
    category: string;
    values: number[];
  }>;
  title: string;
  gradient?: string;
}

interface BoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

function calculateBoxStats(values: number[]): BoxStats {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  const q1Index = Math.floor(n * 0.25);
  const medianIndex = Math.floor(n * 0.5);
  const q3Index = Math.floor(n * 0.75);
  
  const q1 = sorted[q1Index];
  const median = n % 2 === 0 ? (sorted[medianIndex - 1] + sorted[medianIndex]) / 2 : sorted[medianIndex];
  const q3 = sorted[q3Index];
  
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  
  const outliers = sorted.filter(v => v < lowerFence || v > upperFence);
  const filteredValues = sorted.filter(v => v >= lowerFence && v <= upperFence);
  
  return {
    min: Math.min(...filteredValues),
    q1,
    median,
    q3,
    max: Math.max(...filteredValues),
    outliers
  };
}

export function BoxPlot({ data, title, gradient = 'from-teal-500/20 to-cyan-500/20' }: BoxPlotProps) {
  const boxWidth = 60;
  const chartHeight = 300;
  const margin = { top: 20, right: 30, bottom: 60, left: 40 };
  
  const allValues = data.flatMap(d => d.values);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const range = globalMax - globalMin;
  
  const yScale = (value: number) => {
    return chartHeight - margin.bottom - ((value - globalMin) / range) * (chartHeight - margin.top - margin.bottom);
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80 overflow-x-auto">
        <svg width={Math.max(400, data.length * 100)} height={chartHeight} className="text-gray-300">
          {/* Y-axis */}
          <line 
            x1={margin.left} 
            y1={margin.top} 
            x2={margin.left} 
            y2={chartHeight - margin.bottom}
            stroke="#374151"
            strokeWidth={1}
          />
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const value = globalMin + range * ratio;
            const y = yScale(value);
            return (
              <g key={ratio}>
                <line 
                  x1={margin.left - 5} 
                  y1={y} 
                  x2={margin.left} 
                  y2={y}
                  stroke="#374151"
                />
                <text 
                  x={margin.left - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  fontSize="12" 
                  fill="#9ca3af"
                >
                  {value.toFixed(0)}
                </text>
              </g>
            );
          })}
          
          {data.map((item, index) => {
            const stats = calculateBoxStats(item.values);
            const x = margin.left + (index + 1) * 100;
            
            return (
              <g key={item.category}>
                {/* Box */}
                <rect
                  x={x - boxWidth / 2}
                  y={yScale(stats.q3)}
                  width={boxWidth}
                  height={yScale(stats.q1) - yScale(stats.q3)}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                
                {/* Median line */}
                <line
                  x1={x - boxWidth / 2}
                  y1={yScale(stats.median)}
                  x2={x + boxWidth / 2}
                  y2={yScale(stats.median)}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                
                {/* Whiskers */}
                <line
                  x1={x}
                  y1={yScale(stats.q3)}
                  x2={x}
                  y2={yScale(stats.max)}
                  stroke="#3b82f6"
                  strokeWidth={1}
                />
                <line
                  x1={x}
                  y1={yScale(stats.q1)}
                  x2={x}
                  y2={yScale(stats.min)}
                  stroke="#3b82f6"
                  strokeWidth={1}
                />
                
                {/* Whisker caps */}
                <line
                  x1={x - 10}
                  y1={yScale(stats.max)}
                  x2={x + 10}
                  y2={yScale(stats.max)}
                  stroke="#3b82f6"
                  strokeWidth={1}
                />
                <line
                  x1={x - 10}
                  y1={yScale(stats.min)}
                  x2={x + 10}
                  y2={yScale(stats.min)}
                  stroke="#3b82f6"
                  strokeWidth={1}
                />
                
                {/* Outliers */}
                {stats.outliers.map((outlier, outlierIndex) => (
                  <circle
                    key={outlierIndex}
                    cx={x}
                    cy={yScale(outlier)}
                    r={3}
                    fill="#ef4444"
                    stroke="#ef4444"
                  />
                ))}
                
                {/* Category label */}
                <text
                  x={x}
                  y={chartHeight - margin.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#9ca3af"
                  transform={`rotate(-45, ${x}, ${chartHeight - margin.bottom + 20})`}
                >
                  {item.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}