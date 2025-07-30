'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { scaleLinear } from 'd3-scale';

interface HeatMapProps {
  data: Array<{
    x: string;
    y: string;
    value: number;
  }>;
  title: string;
  gradient?: string;
}

export function HeatMap({ data, title, gradient = 'from-blue-500/20 to-purple-500/20' }: HeatMapProps) {
  if (!data.length) return null;

  const xLabels = Array.from(new Set(data.map(d => d.x)));
  const yLabels = Array.from(new Set(data.map(d => d.y)));
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const colorScale = scaleLinear<string>()
    .domain([minValue, maxValue])
    .range(['#1e293b', '#3b82f6']);

  const cellWidth = Math.max(60, Math.min(120, 600 / xLabels.length));
  const cellHeight = 40;

  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-24"></div>
            {xLabels.map(label => (
              <div 
                key={label} 
                className="text-xs text-gray-400 text-center font-medium"
                style={{ width: cellWidth }}
              >
                <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap">
                  {label}
                </div>
              </div>
            ))}
          </div>
          
          {yLabels.map(yLabel => (
            <div key={yLabel} className="flex items-center">
              <div className="w-24 text-xs text-gray-400 text-right pr-2 font-medium">
                {yLabel}
              </div>
              {xLabels.map(xLabel => {
                const dataPoint = data.find(d => d.x === xLabel && d.y === yLabel);
                const value = dataPoint?.value || 0;
                const color = colorScale(value);
                
                return (
                  <div
                    key={`${xLabel}-${yLabel}`}
                    className="border border-gray-700/30 flex items-center justify-center text-xs text-white font-medium hover:border-gray-500 transition-colors cursor-pointer group relative"
                    style={{ 
                      width: cellWidth, 
                      height: cellHeight, 
                      backgroundColor: color 
                    }}
                  >
                    {value > 0 && (
                      <>
                        <span className="opacity-80 group-hover:opacity-100">
                          {value.toLocaleString()}
                        </span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {xLabel} × {yLabel}: {value.toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <span className="text-xs text-gray-400">Low</span>
        <div className="flex h-4 w-32 rounded">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="flex-1 first:rounded-l last:rounded-r"
              style={{
                backgroundColor: colorScale(minValue + (maxValue - minValue) * (i / 9))
              }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">High</span>
      </div>
    </Card>
  );
}