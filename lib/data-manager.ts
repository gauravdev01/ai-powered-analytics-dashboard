import { VahanData, IdspData, PopulationData, AqiData } from '@/types/data';
import { CSVLoader } from './csv-loader';

export interface DataStats {
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  count: number;
}

export interface ColumnInfo {
  name: string;
  type: 'categorical' | 'numeric' | 'date' | 'text';
  uniqueValues?: string[];
  stats?: DataStats;
}

export class DataManager {
  private static instance: DataManager;
  private vahanData: VahanData[] = [];
  private idspData: IdspData[] = [];
  private populationData: PopulationData[] = [];
  private aqiData: AqiData[] = [];
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  async loadAllData(): Promise<void> {
    // If already loaded, return immediately
    if (this.isLoaded) return;
    
    // If currently loading, return the existing promise
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading
    this.isLoading = true;
    this.loadPromise = this.performLoad();
    
    try {
      await this.loadPromise;
    } finally {
      this.isLoading = false;
      this.loadPromise = null;
    }
  }

  private async performLoad(): Promise<void> {
    try {
      console.log('DataManager: Starting data load...');
      const startTime = performance.now();
      
      // Test file access first
      console.log('DataManager: Testing file access...');
      const fileAccess = await CSVLoader.testFileAccess();
      console.log('DataManager: File access results:', fileAccess);
      
      // Check if any files are accessible
      const accessibleFiles = Object.values(fileAccess).filter(Boolean).length;
      if (accessibleFiles === 0) {
        console.warn('DataManager: No CSV files accessible, using mock data');
        this.loadMockData();
        this.isLoaded = true;
        return;
      }
      
      // Use the optimized CSV loader with timeout
      const loadPromise = CSVLoader.loadAllData();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Data loading timeout')), 30000) // 30 second timeout
      );
      
      const data = await Promise.race([loadPromise, timeoutPromise]) as any;
      
      this.vahanData = data.vahan || [];
      this.idspData = data.idsp || [];
      this.populationData = data.population || [];
      this.aqiData = data.aqi || [];

      this.isLoaded = true;
      
      const endTime = performance.now();
      console.log(`DataManager: Data loaded successfully in ${(endTime - startTime).toFixed(2)}ms:`, {
        vahan: this.vahanData.length,
        idsp: this.idspData.length,
        population: this.populationData.length,
        aqi: this.aqiData.length,
        totalRecords: this.vahanData.length + this.idspData.length + this.populationData.length + this.aqiData.length
      });
      
      // If no data was loaded, use mock data
      if (this.vahanData.length === 0 && this.idspData.length === 0 && 
          this.populationData.length === 0 && this.aqiData.length === 0) {
        console.warn('DataManager: No data loaded, using mock data as fallback');
        this.loadMockData();
      }
    } catch (error) {
      console.error('DataManager: Error loading data:', error);
      // Use fallback mock data
      this.loadMockData();
      this.isLoaded = true; // Mark as loaded even with mock data
    }
  }

  private loadMockData(): void {
    console.log('DataManager: Loading comprehensive mock data as fallback...');
    
    // Enhanced mock data with more realistic patterns and larger datasets
    this.vahanData = Array.from({ length: 500 }, (_, i) => ({
      state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'][i % 5],
      district: ['Mumbai', 'New Delhi', 'Bangalore', 'Chennai', 'Ahmedabad'][i % 5],
      vehicle_class: ['Car', 'Motorcycle', 'Bus', 'Truck', 'SUV'][i % 5],
      fuel: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'][i % 5],
      year: 2020 + (i % 4),
      month: 1 + (i % 12),
      value: Math.floor(Math.random() * 50000) + 1000
    }));

    this.idspData = Array.from({ length: 300 }, (_, i) => ({
      state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'][i % 5],
      district: ['Mumbai', 'New Delhi', 'Bangalore', 'Chennai', 'Ahmedabad'][i % 5],
      disease_illness_name: ['COVID-19', 'Dengue', 'Malaria', 'Tuberculosis', 'Pneumonia'][i % 5],
      outbreak_starting_date: new Date(2020 + (i % 4), i % 12, 1),
      reporting_date: new Date(2020 + (i % 4), i % 12, 15),
      cases: Math.floor(Math.random() * 1000) + 10,
      deaths: Math.floor(Math.random() * 50) + 1,
      status: ['Active', 'Controlled', 'Resolved'][i % 3]
    }));

    this.populationData = Array.from({ length: 400 }, (_, i) => ({
      state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'][i % 5],
      district: ['Mumbai', 'New Delhi', 'Bangalore', 'Chennai', 'Ahmedabad'][i % 5],
      gender: ['Male', 'Female', 'Other'][i % 3],
      age_group: ['0-14', '15-24', '25-54', '55-64', '65+'][i % 5],
      year: 2020 + (i % 4),
      value: Math.floor(Math.random() * 1000000) + 10000
    }));

    this.aqiData = Array.from({ length: 600 }, (_, i) => ({
      state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'][i % 5],
      area: ['Mumbai', 'New Delhi', 'Bangalore', 'Chennai', 'Ahmedabad'][i % 5],
      date: new Date(2020 + (i % 4), i % 12, 1 + (i % 28)),
      aqi_value: Math.floor(Math.random() * 500) + 50,
      air_quality_status: ['Good', 'Moderate', 'Poor', 'Very Poor', 'Severe'][Math.floor(Math.random() * 5)],
      prominent_pollutants: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO'][i % 5],
      number_of_monitoring_stations: Math.floor(Math.random() * 20) + 1
    }));

    console.log('DataManager: Mock data loaded successfully:', {
      vahan: this.vahanData.length,
      idsp: this.idspData.length,
      population: this.populationData.length,
      aqi: this.aqiData.length
    });
  }

  // Data access methods with validation
  getVahanData(): VahanData[] { 
    if (!this.isLoaded) {
      console.warn('DataManager: Data not loaded yet, returning empty array');
      return [];
    }
    return this.vahanData; 
  }
  
  getIdspData(): IdspData[] { 
    if (!this.isLoaded) {
      console.warn('DataManager: Data not loaded yet, returning empty array');
      return [];
    }
    return this.idspData; 
  }
  
  getPopulationData(): PopulationData[] { 
    if (!this.isLoaded) {
      console.warn('DataManager: Data not loaded yet, returning empty array');
      return [];
    }
    return this.populationData; 
  }
  
  getAqiData(): AqiData[] { 
    if (!this.isLoaded) {
      console.warn('DataManager: Data not loaded yet, returning empty array');
      return [];
    }
    return this.aqiData; 
  }

  // Check if data is loaded
  isDataLoaded(): boolean {
    return this.isLoaded;
  }

  // Get loading status
  getLoadingStatus(): { isLoading: boolean; isLoaded: boolean } {
    return { isLoading: this.isLoading, isLoaded: this.isLoaded };
  }

  // Clear cache and reload data
  async reloadData(): Promise<void> {
    console.log('DataManager: Reloading data...');
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
    CSVLoader.clearCache();
    await this.loadAllData();
  }

  // Statistical analysis methods with performance optimizations
  calculateStats(values: number[]): DataStats {
    if (values.length === 0) {
      return { mean: 0, median: 0, min: 0, max: 0, stdDev: 0, count: 0 };
    }

    // Use more efficient calculation for large datasets
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    // Use more efficient variance calculation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean,
      median,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      stdDev,
      count: values.length,
    };
  }

  getUniqueValues<T>(data: T[], key: keyof T): string[] {
    const uniqueSet = new Set<string>();
    for (const item of data) {
      const value = String(item[key]);
      if (value && value.trim()) {
        uniqueSet.add(value.trim());
      }
    }
    return Array.from(uniqueSet).sort();
  }

  getUniqueNumbers<T>(data: T[], key: keyof T): number[] {
    const uniqueSet = new Set<number>();
    for (const item of data) {
      const value = Number(item[key]);
      if (!isNaN(value)) {
        uniqueSet.add(value);
      }
    }
    return Array.from(uniqueSet).sort((a, b) => a - b);
  }

  // Correlation analysis with validation
  calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Anomaly detection with configurable threshold
  detectAnomalies(values: number[], threshold: number = 2): number[] {
    if (values.length === 0) return [];
    
    const stats = this.calculateStats(values);
    const thresholdValue = threshold * stats.stdDev;
    
    return values.filter(value => 
      Math.abs(value - stats.mean) > thresholdValue
    );
  }

  // Get data summary for performance monitoring
  getDataSummary(): {
    totalRecords: number;
    vahanCount: number;
    idspCount: number;
    populationCount: number;
    aqiCount: number;
    isLoaded: boolean;
    isLoading: boolean;
  } {
    return {
      totalRecords: this.vahanData.length + this.idspData.length + this.populationData.length + this.aqiData.length,
      vahanCount: this.vahanData.length,
      idspCount: this.idspData.length,
      populationCount: this.populationData.length,
      aqiCount: this.aqiData.length,
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
    };
  }
}