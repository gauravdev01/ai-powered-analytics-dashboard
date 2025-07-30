export interface VahanData {
  state: string;
  district: string;
  vehicle_class: string;
  fuel: string;
  year: number;
  month: number;
  value: number;
}

export interface IdspData {
  state: string;
  district: string;
  disease_illness_name: string;
  outbreak_starting_date: Date;
  reporting_date: Date;
  cases: number;
  deaths: number;
  status: string;
}

export interface PopulationData {
  state: string;
  district: string;
  gender: string;
  year: number;
  value: number;
}

export interface AqiData {
  state: string;
  area: string;
  date: Date;
  aqi_value: number;
  air_quality_status: string;
  prominent_pollutants: string;
  number_of_monitoring_stations: number;
}

export interface FilterState {
  timeRange: {
    startDate?: Date;
    endDate?: Date;
    years: number[];
    months: number[];
  };
  geographical: {
    states: string[];
    districts: string[];
    areas: string[];
  };
  categorical: {
    vehicleClasses: string[];
    fuelTypes: string[];
    diseases: string[];
    statuses: string[];
    genders: string[];
    pollutants: string[];
    aqiStatuses: string[];
  };
}