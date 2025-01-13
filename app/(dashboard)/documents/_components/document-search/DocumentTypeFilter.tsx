'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DOCUMENT_TYPES = [
  'K-1',
  'Statement',
  'Report',
  'Tax Document',
  'Agreement',
  'Other',
] as const;

interface DocumentTypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

export function DocumentTypeFilter({ selectedType, onChange }: DocumentTypeFilterProps) {
  return (
    <Select value={selectedType || 'all'} onValueChange={(value) => onChange(value === 'all' ? null : value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All types</SelectItem>
        {DOCUMENT_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 