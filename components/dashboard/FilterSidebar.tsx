'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { FilterState } from '@/types/data';
import { format } from 'date-fns';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableOptions: {
    states: string[];
    districts: string[];
    areas: string[];
    vehicleClasses: string[];
    fuelTypes: string[];
    diseases: string[];
    statuses: string[];
    genders: string[];
    pollutants: string[];
    aqiStatuses: string[];
    years: number[];
    months: number[];
  };
}

export function FilterSidebar({ filters, onFiltersChange, availableOptions }: FilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateFilters = (section: keyof FilterState, updates: any) => {
    onFiltersChange({
      ...filters,
      [section]: { ...filters[section], ...updates },
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
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
  };

  const MultiSelectCheckbox = ({ 
    title, 
    options, 
    selected, 
    onChange 
  }: { 
    title: string; 
    options: (string | number)[]; 
    selected: (string | number)[]; 
    onChange: (values: (string | number)[]) => void;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-white">{title}</Label>
      <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${option}`}
              checked={selected.includes(option)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selected, option]);
                } else {
                  onChange(selected.filter(item => item !== option));
                }
              }}
              className="border-gray-600 data-[state=checked]:bg-blue-600"
            />
            <Label 
              htmlFor={`${title}-${option}`} 
              className="text-xs text-white/80 cursor-pointer hover:text-white transition-colors"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="w-12 bg-black/90 backdrop-blur-sm border-r border-gray-800 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="w-full h-10 text-white hover:text-blue-300 hover:bg-gray-800/50"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-black/90 backdrop-blur-sm border-r border-gray-800 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          Filters
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-white/80 hover:text-white hover:bg-gray-800/50"
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="text-white/80 hover:text-white hover:bg-gray-800/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Time Range Filters */}
        <Card className="p-4 bg-gray-900/50 border-gray-700 shadow-lg">
          <h3 className="text-sm font-medium text-blue-400 mb-4">Time Range</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.timeRange.startDate ? format(filters.timeRange.startDate, 'PPP') : 'Start Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800/90 border-gray-600 backdrop-blur-sm">
                  <Calendar
                    mode="single"
                    selected={filters.timeRange.startDate}
                    onSelect={(date) => updateFilters('timeRange', { startDate: date })}
                    initialFocus
                    className="bg-gray-800/90 text-white"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.timeRange.endDate ? format(filters.timeRange.endDate, 'PPP') : 'End Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800/90 border-gray-600 backdrop-blur-sm">
                  <Calendar
                    mode="single"
                    selected={filters.timeRange.endDate}
                    onSelect={(date) => updateFilters('timeRange', { endDate: date })}
                    initialFocus
                    className="bg-gray-800/90 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <MultiSelectCheckbox
              title="Years"
              options={availableOptions.years}
              selected={filters.timeRange.years}
              onChange={(years) => updateFilters('timeRange', { years })}
            />

            <MultiSelectCheckbox
              title="Months"
              options={availableOptions.months}
              selected={filters.timeRange.months}
              onChange={(months) => updateFilters('timeRange', { months })}
            />
          </div>
        </Card>

        {/* Geographical Filters */}
        <Card className="p-4 bg-gray-900/50 border-gray-700 shadow-lg">
          <h3 className="text-sm font-medium text-green-400 mb-4">Geography</h3>
          
          <div className="space-y-4">
            <MultiSelectCheckbox
              title="States"
              options={availableOptions.states}
              selected={filters.geographical.states}
              onChange={(states) => updateFilters('geographical', { states })}
            />

            <MultiSelectCheckbox
              title="Districts"
              options={availableOptions.districts}
              selected={filters.geographical.districts}
              onChange={(districts) => updateFilters('geographical', { districts })}
            />

            <MultiSelectCheckbox
              title="Areas"
              options={availableOptions.areas}
              selected={filters.geographical.areas}
              onChange={(areas) => updateFilters('geographical', { areas })}
            />
          </div>
        </Card>

        {/* Categorical Filters */}
        <Card className="p-4 bg-gray-900/50 border-gray-700 shadow-lg">
          <h3 className="text-sm font-medium text-purple-400 mb-4">Categories</h3>
          
          <div className="space-y-4">
            <MultiSelectCheckbox
              title="Vehicle Classes"
              options={availableOptions.vehicleClasses}
              selected={filters.categorical.vehicleClasses}
              onChange={(vehicleClasses) => updateFilters('categorical', { vehicleClasses })}
            />

            <MultiSelectCheckbox
              title="Fuel Types"
              options={availableOptions.fuelTypes}
              selected={filters.categorical.fuelTypes}
              onChange={(fuelTypes) => updateFilters('categorical', { fuelTypes })}
            />

            <MultiSelectCheckbox
              title="Diseases"
              options={availableOptions.diseases}
              selected={filters.categorical.diseases}
              onChange={(diseases) => updateFilters('categorical', { diseases })}
            />

            <MultiSelectCheckbox
              title="AQI Status"
              options={availableOptions.aqiStatuses}
              selected={filters.categorical.aqiStatuses}
              onChange={(aqiStatuses) => updateFilters('categorical', { aqiStatuses })}
            />

            <MultiSelectCheckbox
              title="Pollutants"
              options={availableOptions.pollutants}
              selected={filters.categorical.pollutants}
              onChange={(pollutants) => updateFilters('categorical', { pollutants })}
            />

            <MultiSelectCheckbox
              title="Gender"
              options={availableOptions.genders}
              selected={filters.categorical.genders}
              onChange={(genders) => updateFilters('categorical', { genders })}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}