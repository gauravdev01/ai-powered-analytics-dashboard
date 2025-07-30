'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { DataSummary as DataSummaryType } from '@/lib/ai-insights';
import { format } from 'date-fns';

interface DataSummaryProps {
  summary: DataSummaryType;
}

export function DataSummary({ summary }: DataSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Data Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Records */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Records</h3>
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {summary.totalRecords.toLocaleString()}
          </div>
        </Card>

        {/* Date Range */}
        <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Date Range</h3>
            <Calendar className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-sm text-white">
            {summary.dateRange ? (
              <>
                <div>{format(summary.dateRange.start, 'MMM dd, yyyy')}</div>
                <div className="text-gray-400">to</div>
                <div>{format(summary.dateRange.end, 'MMM dd, yyyy')}</div>
              </>
            ) : (
              'No date data'
            )}
          </div>
        </Card>

        {/* Key Metrics */}
        <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Avg AQI</h3>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {summary.keyMetrics.avgAQI.toFixed(0)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Air Quality Index
          </div>
        </Card>

        {/* Population */}
        <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Population</h3>
            <MapPin className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {(summary.keyMetrics.totalPopulation / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Total Population
          </div>
        </Card>
      </div>

      {/* Top States */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Top States by Activity
        </h3>
        <div className="space-y-3">
          {summary.topStates.map((state, index) => {
            const maxValue = summary.topStates[0]?.value || 1;
            const percentage = (state.value / maxValue) * 100;
            
            return (
              <div key={state.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Badge variant="outline" className="text-xs w-8 text-center">
                    {index + 1}
                  </Badge>
                  <span className="text-white font-medium">{state.name}</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-gray-400 text-sm w-20 text-right">
                    {state.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Anomalies and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomalies */}
        <Card className="p-6 bg-gradient-to-br from-red-500/20 to-pink-500/20 border-gray-700/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Data Anomalies
          </h3>
          <div className="space-y-2">
            {summary.anomalies.length > 0 ? (
              summary.anomalies.map((anomaly, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{anomaly}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">No anomalies detected</span>
              </div>
            )}
          </div>
        </Card>

        {/* Trends */}
        <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-gray-700/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Key Trends
          </h3>
          <div className="space-y-2">
            {summary.trends.length > 0 ? (
              summary.trends.map((trend, index) => (
                <div key={index} className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{trend}</span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">No trends identified</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}