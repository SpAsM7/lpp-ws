'use client';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentDateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
}

export function DocumentDateFilter({ startDate, endDate, onChange }: DocumentDateFilterProps) {
  const buttonText = startDate && endDate
    ? `${format(startDate, 'PP')} - ${format(endDate, 'PP')}`
    : 'Filter by date';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{
            from: startDate || undefined,
            to: endDate || undefined,
          }}
          onSelect={(range) => {
            onChange(range?.from || null, range?.to || null);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
} 