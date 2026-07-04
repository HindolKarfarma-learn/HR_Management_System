import { useState } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function Calendar({ selected, onSelect, markers = [] }) {
  const [month, setMonth] = useState(dayjs(selected));
  const start = month.startOf('month');
  const mondayOffset = (start.day() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, index) => start.subtract(mondayOffset, 'day').add(index, 'day'));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold text-slate-900">{month.format('MMMM YYYY')}</p>
        <div className="flex gap-1">
          <button type="button" onClick={() => setMonth((value) => value.subtract(1, 'month'))} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Previous month"><ChevronLeft className="size-4" /></button>
          <button type="button" onClick={() => setMonth((value) => value.add(1, 'month'))} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Next month"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center">
        {weekdays.map((day) => <span key={day} className="pb-2 text-xs font-semibold text-slate-400">{day}</span>)}
        {days.map((day) => {
          const active = selected && day.isSame(selected, 'day');
          const marked = markers.some((marker) => day.isSame(marker, 'day'));
          return (
            <button
              key={day.format('YYYY-MM-DD')}
              type="button"
              onClick={() => onSelect?.(day)}
              className={cn(
                'relative mx-auto grid size-9 place-items-center rounded-lg text-sm transition',
                !day.isSame(month, 'month') && 'text-slate-300',
                active ? 'bg-brand-600 font-semibold text-white' : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {day.date()}
              {marked && !active && <span className="absolute bottom-1 size-1 rounded-full bg-brand-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
