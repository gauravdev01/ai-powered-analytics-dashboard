'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, Download, RefreshCw } from 'lucide-react';
import { InsightCard } from '@/lib/ai-insights';

interface AIInsightsProps {
  insights: InsightCard[];
  onRefresh: () => void;
}

export function AIInsights({ insights, onRefresh }: AIInsightsProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      case 'alert': return <AlertTriangle className="w-5 h-5" />;
      case 'correlation': return <Target className="w-5 h-5" />;
      case 'anomaly': return <Brain className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          AI-Powered Insights
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight) => (
          <Card 
            key={insight.id}
            className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${insight.color} bg-opacity-20`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {insight.title}
                  </h3>
                  <Badge className={`text-xs ${getSeverityColor(insight.severity)}`}>
                    {insight.severity.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              </div>
              {insight.value && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {insight.value}
                  </div>
                  {insight.change && (
                    <div className={`text-sm ${insight.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {insight.change > 0 ? '+' : ''}{insight.change}%
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              {insight.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                {insight.type.toUpperCase()}
              </Badge>
              <div className="text-2xl">
                {insight.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {insights.length === 0 && (
        <Card className="p-12 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-sm text-center">
          <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Insights Available</h3>
          <p className="text-gray-500">
            Apply filters to generate AI-powered insights from your data.
          </p>
        </Card>
      )}
    </div>
  );
}