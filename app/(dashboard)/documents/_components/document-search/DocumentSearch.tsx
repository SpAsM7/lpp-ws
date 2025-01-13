'use client';

import { DocumentDateFilter } from './DocumentDateFilter';
import { DocumentTypeFilter } from './DocumentTypeFilter';
import type { DocumentSearchParams } from '@/lib/domains/documents/types';

interface DocumentSearchProps {
  searchParams: DocumentSearchParams;
  onDateChange: (dates: { startDate?: Date; endDate?: Date }) => void;
  onTypeChange: (type: string | undefined) => void;
}

export function DocumentSearch({ 
  searchParams,
  onDateChange,
  onTypeChange,
}: DocumentSearchProps) {
  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    onDateChange({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <div className="flex gap-4">
      <DocumentTypeFilter
        selectedType={searchParams.filters?.type?.[0] || null}
        onChange={(type) => onTypeChange(type === null ? undefined : type)}
      />
      <DocumentDateFilter 
        startDate={searchParams.filters?.dateRange?.start ? new Date(searchParams.filters.dateRange.start) : null}
        endDate={searchParams.filters?.dateRange?.end ? new Date(searchParams.filters.dateRange.end) : null}
        onChange={handleDateChange} 
      />
    </div>
  );
} 