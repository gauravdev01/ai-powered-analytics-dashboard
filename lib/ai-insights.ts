import { DataManager } from './data-manager';
import { VahanData, IdspData, PopulationData, AqiData, FilterState } from '@/types/data';

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'correlation' | 'anomaly' | 'comparison' | 'alert';
  severity: 'low' | 'medium' | 'high';
  value?: string | number;
  change?: number;
  icon: string;
  color: string;
}

export interface DataSummary {
  totalRecords: number;
  dateRange: { start: Date; end: Date } | null;
  topStates: Array<{ name: string; value: number }>;
  keyMetrics: Record<string, number>;
  anomalies: string[];
  trends: string[];
}

export class AIInsightsEngine {
  private dataManager: DataManager;

  constructor() {
    this.dataManager = DataManager.getInstance();
  }

  generateInsights(filteredData: {
    vahan: VahanData[];
    idsp: IdspData[];
    population: PopulationData[];
    aqi: AqiData[];
  }): InsightCard[] {
    const insights: InsightCard[] = [];

    // Vehicle registration trends
    insights.push(...this.analyzeVehicleTrends(filteredData.vahan));
    
    // Health and AQI correlations
    insights.push(...this.analyzeHealthAQICorrelation(filteredData.idsp, filteredData.aqi));
    
    // Population and infrastructure insights
    insights.push(...this.analyzePopulationInsights(filteredData.population, filteredData.vahan));
    
    // Anomaly detection
    insights.push(...this.detectDataAnomalies(filteredData));

    return insights.slice(0, 8); // Return top 8 insights
  }

  private analyzeVehicleTrends(vahanData: VahanData[]): InsightCard[] {
    const insights: InsightCard[] = [];

    if (vahanData.length === 0) return insights;

    // Analyze fuel type trends
    const fuelDistribution = vahanData.reduce((acc, item) => {
      acc[item.fuel] = (acc[item.fuel] || 0) + item.value;
      return acc;
    }, {} as Record<string, number>);

    const totalVehicles = Object.values(fuelDistribution).reduce((sum, val) => sum + val, 0);
    const electricPercentage = ((fuelDistribution['Electric'] || 0) / totalVehicles) * 100;

    if (electricPercentage > 5) {
      insights.push({
        id: 'electric-adoption',
        title: 'Electric Vehicle Adoption Rising',
        description: `Electric vehicles represent ${electricPercentage.toFixed(1)}% of registrations, indicating strong sustainable transport adoption.`,
        type: 'trend',
        severity: 'medium',
        value: `${electricPercentage.toFixed(1)}%`,
        icon: '⚡',
        color: 'text-green-400',
      });
    }

    // Analyze vehicle class distribution
    const classDistribution = vahanData.reduce((acc, item) => {
      acc[item.vehicle_class] = (acc[item.vehicle_class] || 0) + item.value;
      return acc;
    }, {} as Record<string, number>);

    const motorcyclePercentage = ((classDistribution['Motorcycle'] || 0) / totalVehicles) * 100;
    
    if (motorcyclePercentage > 60) {
      insights.push({
        id: 'motorcycle-dominance',
        title: 'Two-Wheeler Market Dominance',
        description: `Motorcycles account for ${motorcyclePercentage.toFixed(1)}% of registrations, suggesting urban mobility preferences.`,
        type: 'comparison',
        severity: 'low',
        value: `${motorcyclePercentage.toFixed(1)}%`,
        icon: '🏍️',
        color: 'text-blue-400',
      });
    }

    return insights;
  }

  private analyzeHealthAQICorrelation(idspData: IdspData[], aqiData: AqiData[]): InsightCard[] {
    const insights: InsightCard[] = [];

    if (idspData.length === 0 || aqiData.length === 0) return insights;

    // Calculate average AQI
    const avgAQI = aqiData.reduce((sum, item) => sum + item.aqi_value, 0) / aqiData.length;
    
    // Calculate total health cases
    const totalCases = idspData.reduce((sum, item) => sum + item.cases, 0);
    const totalDeaths = idspData.reduce((sum, item) => sum + item.deaths, 0);
    const mortalityRate = (totalDeaths / totalCases) * 100;

    if (avgAQI > 200) {
      insights.push({
        id: 'high-aqi-alert',
        title: 'Critical Air Quality Alert',
        description: `Average AQI of ${avgAQI.toFixed(0)} indicates severe air pollution requiring immediate intervention.`,
        type: 'alert',
        severity: 'high',
        value: avgAQI.toFixed(0),
        icon: '🚨',
        color: 'text-red-400',
      });
    }

    if (mortalityRate > 2) {
      insights.push({
        id: 'health-concern',
        title: 'Elevated Health Risk',
        description: `Disease mortality rate of ${mortalityRate.toFixed(1)}% suggests need for enhanced healthcare response.`,
        type: 'alert',
        severity: 'high',
        value: `${mortalityRate.toFixed(1)}%`,
        icon: '⚕️',
        color: 'text-orange-400',
      });
    }

    return insights;
  }

  private analyzePopulationInsights(populationData: PopulationData[], vahanData: VahanData[]): InsightCard[] {
    const insights: InsightCard[] = [];

    if (populationData.length === 0) return insights;

    // Gender distribution analysis
    const genderDistribution = populationData.reduce((acc, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + item.value;
      return acc;
    }, {} as Record<string, number>);

    const totalPopulation = Object.values(genderDistribution).reduce((sum, val) => sum + val, 0);
    const femalePercentage = ((genderDistribution['Female'] || 0) / totalPopulation) * 100;

    if (Math.abs(femalePercentage - 50) > 5) {
      insights.push({
        id: 'gender-imbalance',
        title: 'Gender Distribution Imbalance',
        description: `Female population at ${femalePercentage.toFixed(1)}% indicates demographic imbalance requiring policy attention.`,
        type: 'comparison',
        severity: 'medium',
        value: `${femalePercentage.toFixed(1)}%`,
        icon: '👥',
        color: 'text-purple-400',
      });
    }

    // Vehicle per capita analysis
    if (vahanData.length > 0) {
      const totalVehicles = vahanData.reduce((sum, item) => sum + item.value, 0);
      const vehiclesPerCapita = (totalVehicles / totalPopulation) * 1000;

      if (vehiclesPerCapita > 100) {
        insights.push({
          id: 'high-vehicle-density',
          title: 'High Vehicle Density',
          description: `${vehiclesPerCapita.toFixed(0)} vehicles per 1000 people suggests infrastructure strain and pollution concerns.`,
          type: 'correlation',
          severity: 'medium',
          value: vehiclesPerCapita.toFixed(0),
          icon: '🚗',
          color: 'text-yellow-400',
        });
      }
    }

    return insights;
  }

  private detectDataAnomalies(filteredData: {
    vahan: VahanData[];
    idsp: IdspData[];
    population: PopulationData[];
    aqi: AqiData[];
  }): InsightCard[] {
    const insights: InsightCard[] = [];

    // AQI anomalies
    if (filteredData.aqi.length > 0) {
      const aqiValues = filteredData.aqi.map(item => item.aqi_value);
      const anomalies = this.dataManager.detectAnomalies(aqiValues);
      
      if (anomalies.length > 0) {
        const maxAnomaly = Math.max(...anomalies);
        insights.push({
          id: 'aqi-anomaly',
          title: 'AQI Anomaly Detected',
          description: `Unusual AQI spike of ${maxAnomaly.toFixed(0)} detected, ${anomalies.length} anomalous readings found.`,
          type: 'anomaly',
          severity: 'high',
          value: maxAnomaly.toFixed(0),
          icon: '📊',
          color: 'text-red-400',
        });
      }
    }

    // Vehicle registration anomalies
    if (filteredData.vahan.length > 0) {
      const vehicleValues = filteredData.vahan.map(item => item.value);
      const anomalies = this.dataManager.detectAnomalies(vehicleValues);
      
      if (anomalies.length > 0) {
        insights.push({
          id: 'vehicle-anomaly',
          title: 'Unusual Registration Pattern',
          description: `${anomalies.length} districts show abnormal vehicle registration patterns requiring investigation.`,
          type: 'anomaly',
          severity: 'medium',
          value: anomalies.length.toString(),
          icon: '📈',
          color: 'text-orange-400',
        });
      }
    }

    return insights;
  }

  generateDataSummary(filteredData: {
    vahan: VahanData[];
    idsp: IdspData[];
    population: PopulationData[];
    aqi: AqiData[];
  }): DataSummary {
    const totalRecords = Object.values(filteredData).reduce((sum, data) => sum + data.length, 0);

    // Calculate date range
    const allDates: Date[] = [
      ...filteredData.idsp.map(item => item.outbreak_starting_date),
      ...filteredData.aqi.map(item => item.date),
    ];
    
    const dateRange = allDates.length > 0 ? {
      start: new Date(Math.min(...allDates.map(d => d.getTime()))),
      end: new Date(Math.max(...allDates.map(d => d.getTime()))),
    } : null;

    // Top states by various metrics
    const stateMetrics = this.calculateStateMetrics(filteredData);
    const topStates = Object.entries(stateMetrics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    // Key metrics
    const keyMetrics = {
      totalVehicles: filteredData.vahan.reduce((sum, item) => sum + item.value, 0),
      totalCases: filteredData.idsp.reduce((sum, item) => sum + item.cases, 0),
      avgAQI: filteredData.aqi.length > 0 
        ? filteredData.aqi.reduce((sum, item) => sum + item.aqi_value, 0) / filteredData.aqi.length 
        : 0,
      totalPopulation: filteredData.population.reduce((sum, item) => sum + item.value, 0),
    };

    // Generate anomalies and trends
    const anomalies = this.generateAnomalyDescriptions(filteredData);
    const trends = this.generateTrendDescriptions(filteredData);

    return {
      totalRecords,
      dateRange,
      topStates,
      keyMetrics,
      anomalies,
      trends,
    };
  }

  private calculateStateMetrics(filteredData: {
    vahan: VahanData[];
    idsp: IdspData[];
    population: PopulationData[];
    aqi: AqiData[];
  }): Record<string, number> {
    const stateMetrics: Record<string, number> = {};

    // Combine metrics from all data sources
    filteredData.vahan.forEach(item => {
      stateMetrics[item.state] = (stateMetrics[item.state] || 0) + item.value;
    });

    filteredData.population.forEach(item => {
      stateMetrics[item.state] = (stateMetrics[item.state] || 0) + item.value * 0.001; // Scale down population
    });

    return stateMetrics;
  }

  private generateAnomalyDescriptions(filteredData: any): string[] {
    const anomalies: string[] = [];

    // Check for data quality issues
    if (filteredData.aqi.some((item: AqiData) => item.aqi_value > 500)) {
      anomalies.push('Extreme AQI values detected (>500)');
    }

    if (filteredData.idsp.some((item: IdspData) => item.deaths > item.cases)) {
      anomalies.push('Data inconsistency: Deaths exceed cases in some records');
    }

    return anomalies;
  }

  private generateTrendDescriptions(filteredData: any): string[] {
    const trends: string[] = [];

    // Analyze trends
    if (filteredData.vahan.length > 0) {
      const electricVehicles = filteredData.vahan.filter((item: VahanData) => 
        item.fuel.toLowerCase().includes('electric')
      ).length;
      
      if (electricVehicles > 0) {
        trends.push('Electric vehicle adoption is increasing');
      }
    }

    if (filteredData.aqi.length > 0) {
      const poorAirQuality = filteredData.aqi.filter((item: AqiData) => 
        item.air_quality_status.toLowerCase().includes('poor')
      ).length;
      
      if (poorAirQuality > filteredData.aqi.length * 0.3) {
        trends.push('Air quality deteriorating in multiple regions');
      }
    }

    return trends;
  }
}