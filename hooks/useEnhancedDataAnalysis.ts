'use client';

import { useState, useEffect, useMemo } from 'react';
import { VahanData, IdspData, PopulationData, AqiData, FilterState } from '@/types/data';
import { DataManager } from '@/lib/data-manager';
import { AIInsightsEngine, InsightCard, DataSummary } from '@/lib/ai-insights';

export function useEnhancedDataAnalysis() {
  const [dataManager] = useState(() => {
    try {
      return DataManager.getInstance();
    } catch (error) {
      console.error('useEnhancedDataAnalysis: Error creating DataManager:', error);
      throw error;
    }
  });
  
  const [aiEngine] = useState(() => {
    try {
      return new AIInsightsEngine();
    } catch (error) {
      console.error('useEnhancedDataAnalysis: Error creating AIInsightsEngine:', error);
      throw error;
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    timeRange: { years: [], months: [] },
    geographical: { states: [], districts: [], areas: [] },
    categorical: {
      vehicleClasses: [],
      fuelTypes: [],
      diseases: [],
      statuses: [],
      genders: [],
      pollutants: [],
      aqiStatuses: [],
    },
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Data loading timeout - please refresh the page')), 45000) // 45 second timeout
        );
        
        const loadPromise = dataManager.loadAllData();
        await Promise.race([loadPromise, timeoutPromise]);
        
      } catch (err) {
        console.error('useEnhancedDataAnalysis: Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data - please refresh the page');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dataManager]);

  // Get raw data
  const rawData = useMemo(() => {
    try {
      return {
        vahan: dataManager.getVahanData(),
        idsp: dataManager.getIdspData(),
        population: dataManager.getPopulationData(),
        aqi: dataManager.getAqiData(),
      };
    } catch (error) {
      console.error('useEnhancedDataAnalysis: Error getting raw data:', error);
      return {
        vahan: [],
        idsp: [],
        population: [],
        aqi: [],
      };
    }
  }, [dataManager, isLoading]);

  // Available filter options
  const availableOptions = useMemo(() => {
    try {
      return {
        states: dataManager.getUniqueValues([...rawData.vahan, ...rawData.idsp, ...rawData.population, ...rawData.aqi], 'state'),
        districts: dataManager.getUniqueValues([...rawData.vahan, ...rawData.idsp, ...rawData.population], 'district'),
        areas: dataManager.getUniqueValues(rawData.aqi, 'area'),
        vehicleClasses: dataManager.getUniqueValues(rawData.vahan, 'vehicle_class'),
        fuelTypes: dataManager.getUniqueValues(rawData.vahan, 'fuel'),
        diseases: dataManager.getUniqueValues(rawData.idsp, 'disease_illness_name'),
        statuses: dataManager.getUniqueValues(rawData.idsp, 'status'),
        genders: dataManager.getUniqueValues(rawData.population, 'gender'),
        pollutants: dataManager.getUniqueValues(rawData.aqi, 'prominent_pollutants'),
        aqiStatuses: dataManager.getUniqueValues(rawData.aqi, 'air_quality_status'),
        years: dataManager.getUniqueNumbers([...rawData.vahan, ...rawData.population], 'year'),
        months: dataManager.getUniqueNumbers(rawData.vahan, 'month'),
      };
    } catch (error) {
      console.error('useEnhancedDataAnalysis: Error getting available options:', error);
      return {
        states: [],
        districts: [],
        areas: [],
        vehicleClasses: [],
        fuelTypes: [],
        diseases: [],
        statuses: [],
        genders: [],
        pollutants: [],
        aqiStatuses: [],
        years: [],
        months: [],
      };
    }
  }, [rawData, dataManager]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    const filterVahan = rawData.vahan.filter(item => {
      if (filters.timeRange.years.length && !filters.timeRange.years.includes(item.year)) return false;
      if (filters.timeRange.months.length && !filters.timeRange.months.includes(item.month)) return false;
      if (filters.geographical.states.length && !filters.geographical.states.includes(item.state)) return false;
      if (filters.geographical.districts.length && !filters.geographical.districts.includes(item.district)) return false;
      if (filters.categorical.vehicleClasses.length && !filters.categorical.vehicleClasses.includes(item.vehicle_class)) return false;
      if (filters.categorical.fuelTypes.length && !filters.categorical.fuelTypes.includes(item.fuel)) return false;
      return true;
    });

    const filterIdsp = rawData.idsp.filter(item => {
      if (filters.geographical.states.length && !filters.geographical.states.includes(item.state)) return false;
      if (filters.geographical.districts.length && !filters.geographical.districts.includes(item.district)) return false;
      if (filters.categorical.diseases.length && !filters.categorical.diseases.includes(item.disease_illness_name)) return false;
      if (filters.categorical.statuses.length && !filters.categorical.statuses.includes(item.status)) return false;
      return true;
    });

    const filterPopulation = rawData.population.filter(item => {
      if (filters.timeRange.years.length && !filters.timeRange.years.includes(item.year)) return false;
      if (filters.geographical.states.length && !filters.geographical.states.includes(item.state)) return false;
      if (filters.geographical.districts.length && !filters.geographical.districts.includes(item.district)) return false;
      if (filters.categorical.genders.length && !filters.categorical.genders.includes(item.gender)) return false;
      return true;
    });

    const filterAqi = rawData.aqi.filter(item => {
      if (filters.geographical.states.length && !filters.geographical.states.includes(item.state)) return false;
      if (filters.geographical.areas.length && !filters.geographical.areas.includes(item.area)) return false;
      if (filters.categorical.aqiStatuses.length && !filters.categorical.aqiStatuses.includes(item.air_quality_status)) return false;
      if (filters.categorical.pollutants.length && !filters.categorical.pollutants.includes(item.prominent_pollutants)) return false;
      return true;
    });

    return {
      vahan: filterVahan,
      idsp: filterIdsp,
      population: filterPopulation,
      aqi: filterAqi,
    };
  }, [rawData, filters]);

  // Generate analytics
  const analytics = useMemo(() => {
    const totalVehicles = filteredData.vahan.reduce((sum, item) => sum + item.value, 0);
    const totalCases = filteredData.idsp.reduce((sum, item) => sum + item.cases, 0);
    const totalDeaths = filteredData.idsp.reduce((sum, item) => sum + item.deaths, 0);
    const avgAqi = filteredData.aqi.length > 0 
      ? filteredData.aqi.reduce((sum, item) => sum + item.aqi_value, 0) / filteredData.aqi.length 
      : 0;
    const totalPopulation = filteredData.population.reduce((sum, item) => sum + item.value, 0);

    // Enhanced analytics
    const vehicleByClass = filteredData.vahan.reduce((acc, item) => {
      acc[item.vehicle_class] = (acc[item.vehicle_class] || 0) + item.value;
      return acc;
    }, {} as Record<string, number>);

    const aqiByStatus = filteredData.aqi.reduce((acc, item) => {
      acc[item.air_quality_status] = (acc[item.air_quality_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const diseasesByState = filteredData.idsp.reduce((acc, item) => {
      acc[item.state] = (acc[item.state] || 0) + item.cases;
      return acc;
    }, {} as Record<string, number>);

    // Heatmap data for disease intensity by district
    const diseaseHeatmapData = filteredData.idsp.map(item => ({
      x: item.district,
      y: item.disease_illness_name,
      value: item.cases
    }));

    // AQI heatmap data by region
    const aqiHeatmapData = filteredData.aqi.map(item => ({
      x: item.area,
      y: item.state,
      value: item.aqi_value
    }));

    // Bubble chart data for AQI vs Population vs Deaths
    const bubbleData = filteredData.aqi.map(aqiItem => {
      const populationItem = filteredData.population.find(p => p.state === aqiItem.state);
      const diseaseItem = filteredData.idsp.find(d => d.state === aqiItem.state);
      
      return {
        x: aqiItem.aqi_value,
        y: populationItem?.value || 0,
        z: diseaseItem?.deaths || 0,
        name: aqiItem.state
      };
    }).filter(item => item.y > 0);

    // Radar chart data for multi-metric comparison
    const radarData = Object.keys(vehicleByClass).slice(0, 6).map(vehicleClass => ({
      subject: vehicleClass,
      value: vehicleByClass[vehicleClass],
      fullMark: Math.max(...Object.values(vehicleByClass))
    }));

    // Box plot data for AQI distribution by status
    const boxPlotData = Object.keys(aqiByStatus).map(status => ({
      category: status,
      values: filteredData.aqi
        .filter(item => item.air_quality_status === status)
        .map(item => item.aqi_value)
    })).filter(item => item.values.length > 0);

    return {
      totalVehicles,
      totalCases,
      totalDeaths,
      avgAqi: Math.round(avgAqi),
      totalPopulation,
      vehicleByClass: Object.entries(vehicleByClass).map(([name, value]) => ({ name, value })),
      aqiByStatus: Object.entries(aqiByStatus).map(([name, value]) => ({ name, value })),
      diseasesByState: Object.entries(diseasesByState).map(([name, value]) => ({ name, value })),
      diseaseHeatmapData,
      aqiHeatmapData,
      bubbleData,
      radarData,
      boxPlotData,
    };
  }, [filteredData]);

  // Generate AI insights
  const insights = useMemo(() => {
    return aiEngine.generateInsights(filteredData);
  }, [aiEngine, filteredData]);

  // Generate data summary
  const dataSummary = useMemo(() => {
    return aiEngine.generateDataSummary(filteredData);
  }, [aiEngine, filteredData]);

  const refreshInsights = () => {
    // Force re-generation of insights
    setFilters({ ...filters });
  };

  return {
    data: filteredData,
    rawData,
    filters,
    setFilters,
    availableOptions,
    analytics,
    insights,
    dataSummary,
    refreshInsights,
    isLoading,
    error,
    dataManager,
  };
}