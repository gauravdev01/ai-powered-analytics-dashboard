'use client';

import { useState, useEffect, useMemo } from 'react';
import { VahanData, IdspData, PopulationData, AqiData, FilterState } from '@/types/data';
import { DataProcessor } from '@/lib/data-processor';

// Mock data - in a real application, this would come from your CSV files
const mockVahanData: VahanData[] = [
  { state: 'Maharashtra', district: 'Mumbai', vehicle_class: 'Car', fuel: 'Petrol', year: 2023, month: 1, value: 15000 },
  { state: 'Maharashtra', district: 'Mumbai', vehicle_class: 'Motorcycle', fuel: 'Petrol', year: 2023, month: 1, value: 25000 },
  { state: 'Delhi', district: 'New Delhi', vehicle_class: 'Car', fuel: 'Diesel', year: 2023, month: 1, value: 12000 },
  { state: 'Karnataka', district: 'Bangalore', vehicle_class: 'Bus', fuel: 'CNG', year: 2023, month: 2, value: 800 },
];

const mockIdspData: IdspData[] = [
  { 
    state: 'Maharashtra', 
    district: 'Mumbai', 
    disease_illness_name: 'Dengue', 
    outbreak_starting_date: new Date('2023-01-15'), 
    reporting_date: new Date('2023-01-20'), 
    cases: 150, 
    deaths: 2, 
    status: 'Active' 
  },
  { 
    state: 'Delhi', 
    district: 'New Delhi', 
    disease_illness_name: 'Malaria', 
    outbreak_starting_date: new Date('2023-02-01'), 
    reporting_date: new Date('2023-02-05'), 
    cases: 89, 
    deaths: 1, 
    status: 'Controlled' 
  },
];

const mockPopulationData: PopulationData[] = [
  { state: 'Maharashtra', district: 'Mumbai', gender: 'Male', year: 2023, value: 6200000 },
  { state: 'Maharashtra', district: 'Mumbai', gender: 'Female', year: 2023, value: 5800000 },
  { state: 'Delhi', district: 'New Delhi', gender: 'Male', year: 2023, value: 8900000 },
  { state: 'Delhi', district: 'New Delhi', gender: 'Female', year: 2023, value: 8100000 },
];

const mockAqiData: AqiData[] = [
  { 
    state: 'Maharashtra', 
    area: 'Mumbai Central', 
    date: new Date('2023-01-15'), 
    aqi_value: 156, 
    air_quality_status: 'Moderate', 
    prominent_pollutants: 'PM2.5, NO2', 
    number_of_monitoring_stations: 5 
  },
  { 
    state: 'Delhi', 
    area: 'Connaught Place', 
    date: new Date('2023-01-15'), 
    aqi_value: 289, 
    air_quality_status: 'Poor', 
    prominent_pollutants: 'PM2.5, PM10', 
    number_of_monitoring_stations: 8 
  },
];

export function useDataAnalysis() {
  const [vahanData] = useState<VahanData[]>(mockVahanData);
  const [idspData] = useState<IdspData[]>(mockIdspData);
  const [populationData] = useState<PopulationData[]>(mockPopulationData);
  const [aqiData] = useState<AqiData[]>(mockAqiData);
  
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

  const availableOptions = useMemo(() => ({
    states: DataProcessor.getUniqueValues([...vahanData, ...idspData, ...populationData, ...aqiData], 'state'),
    districts: DataProcessor.getUniqueValues([...vahanData, ...idspData, ...populationData], 'district'),
    areas: DataProcessor.getUniqueValues(aqiData, 'area'),
    vehicleClasses: DataProcessor.getUniqueValues(vahanData, 'vehicle_class'),
    fuelTypes: DataProcessor.getUniqueValues(vahanData, 'fuel'),
    diseases: DataProcessor.getUniqueValues(idspData, 'disease_illness_name'),
    statuses: DataProcessor.getUniqueValues(idspData, 'status'),
    genders: DataProcessor.getUniqueValues(populationData, 'gender'),
    pollutants: DataProcessor.getUniqueValues(aqiData, 'prominent_pollutants'),
    aqiStatuses: DataProcessor.getUniqueValues(aqiData, 'air_quality_status'),
    years: DataProcessor.getUniqueNumbers([...vahanData, ...populationData], 'year'),
    months: DataProcessor.getUniqueNumbers(vahanData, 'month'),
  }), [vahanData, idspData, populationData, aqiData]);

  const filteredData = useMemo(() => {
    const filterVahan = vahanData.filter(item => {
      if (filters.timeRange.years.length && !filters.timeRange.years.includes(item.year)) return false;
      if (filters.timeRange.months.length && !filters.timeRange.months.includes(item.month)) return false;
      if (filters.geographical.states.length && !filters.geographical.states.includes(item.state)) return false;
      if (filters.geographical.districts.length && !filters.geographical.districts.includes(item.district)) return false;
      if (filters.categorical.vehicleClasses.length && !filters.categorical.vehicleClasses.includes(item.vehicle_class)) return false;
      if (filters.categorical.fuelTypes.length && !filters.categorical.fuelTypes.includes(item.fuel)) return false;
      return true;
    });

    const filterIdsp = idspData.filter(item => {
      if (filters.geographical.states.length && !filters.geographical.states.includes(item.state)) return false;
      if (filters.geographical.districts.length && !filters.geographical.districts.includes(item.district)) return false;
      if (filters.categorical.diseases.length && !filters.categorical.diseases.includes(item.disease_illness_name)) return false;
      if (filters.categorical.statuses.length && !filters.categorical.statuses.includes(item.status)) return false;
      return true;
    });

    const filterPopulation = populationData.filter(item => {
      if (filters.timeRange.years.length && !filters.timeRange.years.includes(item.year)) return false;
      if (filters.geographical.states.length && !filters.geographical.states.includes(item.state)) return false;
      if (filters.geographical.districts.length && !filters.geographical.districts.includes(item.district)) return false;
      if (filters.categorical.genders.length && !filters.categorical.genders.includes(item.gender)) return false;
      return true;
    });

    const filterAqi = aqiData.filter(item => {
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
  }, [vahanData, idspData, populationData, aqiData, filters]);

  const analytics = useMemo(() => {
    const totalVehicles = filteredData.vahan.reduce((sum, item) => sum + item.value, 0);
    const totalCases = filteredData.idsp.reduce((sum, item) => sum + item.cases, 0);
    const totalDeaths = filteredData.idsp.reduce((sum, item) => sum + item.deaths, 0);
    const avgAqi = filteredData.aqi.length > 0 
      ? filteredData.aqi.reduce((sum, item) => sum + item.aqi_value, 0) / filteredData.aqi.length 
      : 0;
    const totalPopulation = filteredData.population.reduce((sum, item) => sum + item.value, 0);

    // Vehicle distribution by class
    const vehicleByClass = filteredData.vahan.reduce((acc, item) => {
      acc[item.vehicle_class] = (acc[item.vehicle_class] || 0) + item.value;
      return acc;
    }, {} as Record<string, number>);

    // AQI distribution by status
    const aqiByStatus = filteredData.aqi.reduce((acc, item) => {
      acc[item.air_quality_status] = (acc[item.air_quality_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Disease cases by state
    const diseasesByState = filteredData.idsp.reduce((acc, item) => {
      acc[item.state] = (acc[item.state] || 0) + item.cases;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalVehicles,
      totalCases,
      totalDeaths,
      avgAqi: Math.round(avgAqi),
      totalPopulation,
      vehicleByClass: Object.entries(vehicleByClass).map(([name, value]) => ({ name, value })),
      aqiByStatus: Object.entries(aqiByStatus).map(([name, value]) => ({ name, value })),
      diseasesByState: Object.entries(diseasesByState).map(([name, value]) => ({ name, value })),
    };
  }, [filteredData]);

  return {
    data: filteredData,
    filters,
    setFilters,
    availableOptions,
    analytics,
  };
}