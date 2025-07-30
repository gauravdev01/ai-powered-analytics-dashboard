import Papa from 'papaparse';
import { VahanData, IdspData, PopulationData, AqiData } from '@/types/data';

export class DataProcessor {
  static parseCSV<T>(csvContent: string, transformer: (row: any) => T): T[] {
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
    });
    
    return result.data.map(transformer).filter(Boolean);
  }

  static transformVahanData(row: any): VahanData | null {
    try {
      return {
        state: row.state || '',
        district: row.district || '',
        vehicle_class: row.vehicle_class || '',
        fuel: row.fuel || '',
        year: parseInt(row.year) || 0,
        month: parseInt(row.month) || 0,
        value: parseFloat(row.value) || 0,
      };
    } catch {
      return null;
    }
  }

  static transformIdspData(row: any): IdspData | null {
    try {
      return {
        state: row.state || '',
        district: row.district || '',
        disease_illness_name: row.disease_illness_name || '',
        outbreak_starting_date: new Date(row.outbreak_starting_date),
        reporting_date: new Date(row.reporting_date),
        cases: parseInt(row.cases) || 0,
        deaths: parseInt(row.deaths) || 0,
        status: row.status || '',
      };
    } catch {
      return null;
    }
  }

  static transformPopulationData(row: any): PopulationData | null {
    try {
      return {
        state: row.state || '',
        district: row.district || '',
        gender: row.gender || '',
        year: parseInt(row.year) || 0,
        value: parseFloat(row.value) || 0,
      };
    } catch {
      return null;
    }
  }

  static transformAqiData(row: any): AqiData | null {
    try {
      return {
        state: row.state || '',
        area: row.area || '',
        date: new Date(row.date),
        aqi_value: parseFloat(row.aqi_value) || 0,
        air_quality_status: row.air_quality_status || '',
        prominent_pollutants: row.prominent_pollutants || '',
        number_of_monitoring_stations: parseInt(row.number_of_monitoring_stations) || 0,
      };
    } catch {
      return null;
    }
  }

  static getUniqueValues<T>(data: T[], key: keyof T): string[] {
    return Array.from(new Set(data.map(item => String(item[key])).filter(Boolean))).sort();
  }

  static getUniqueNumbers<T>(data: T[], key: keyof T): number[] {
    return Array.from(new Set(data.map(item => Number(item[key])).filter(n => !isNaN(n)))).sort((a, b) => a - b);
  }
}