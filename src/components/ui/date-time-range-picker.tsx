"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/atoms/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// ─── Time Input ─────────────────────────────────────
function TimeInput({
  value,
  onChange,
  label,
}: {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
}) {
  const hours = value.getHours().toString().padStart(2, "0");
  const minutes = value.getMinutes().toString().padStart(2, "0");
  const secs = value.getSeconds().toString().padStart(2, "0");

  const handleChange = (
    field: "hours" | "minutes" | "seconds",
    raw: string
  ) => {
    const num = parseInt(raw, 10);
    if (isNaN(num)) return;

    let updated = new Date(value);
    if (field === "hours" && num >= 0 && num <= 23) {
      updated = setHours(updated, num);
    } else if (field === "minutes" && num >= 0 && num <= 59) {
      updated = setMinutes(updated, num);
    } else if (field === "seconds" && num >= 0 && num <= 59) {
      updated = setSeconds(updated, num);
    } else {
      return;
    }
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5">
        <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={hours}
          onChange={(e) => handleChange("hours", e.target.value)}
          className="w-6 bg-transparent text-center text-sm outline-none"
          aria-label={`${label} hours`}
        />
        <span className="text-sm text-muted-foreground">:</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={minutes}
          onChange={(e) => handleChange("minutes", e.target.value)}
          className="w-6 bg-transparent text-center text-sm outline-none"
          aria-label={`${label} minutes`}
        />
        <span className="text-sm text-muted-foreground">:</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={secs}
          onChange={(e) => handleChange("seconds", e.target.value)}
          className="w-6 bg-transparent text-center text-sm outline-none"
          aria-label={`${label} seconds`}
        />
      </div>
    </div>
  );
}

// ─── DateTimeRange type ─────────────────────────────
export interface DateTimeRange {
  from: Date;
  to: Date;
}

// ─── Main component ─────────────────────────────────
export function DateTimeRangePicker({
  value,
  onChange,
  className,
}: {
  value?: DateTimeRange;
  onChange?: (range: DateTimeRange) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // Internal date range (calendar part only)
  const [calRange, setCalRange] = React.useState<DateRange | undefined>(
    value ? { from: value.from, to: value.to } : undefined
  );

  // Internal time state
  const [fromTime, setFromTime] = React.useState<Date>(
    value?.from ?? new Date(2026, 0, 20, 20, 0, 0)
  );
  const [toTime, setToTime] = React.useState<Date>(
    value?.to ?? new Date(2026, 0, 24, 20, 0, 0)
  );

  // Sync external value changes
  React.useEffect(() => {
    if (value) {
      setCalRange({ from: value.from, to: value.to });
      setFromTime(value.from);
      setToTime(value.to);
    }
  }, [value]);

  // When calendar selection changes, update time states
  const handleCalendarSelect = (range: DateRange | undefined) => {
    setCalRange(range);
    if (range?.from) {
      setFromTime((prev) => {
        const d = new Date(range.from!);
        d.setHours(prev.getHours(), prev.getMinutes(), prev.getSeconds());
        return d;
      });
    }
    if (range?.to) {
      setToTime((prev) => {
        const d = new Date(range.to!);
        d.setHours(prev.getHours(), prev.getMinutes(), prev.getSeconds());
        return d;
      });
    }
  };

  // Combine date + time
  const getCombinedFrom = (): Date => {
    const d = new Date(calRange?.from ?? fromTime);
    d.setHours(fromTime.getHours(), fromTime.getMinutes(), fromTime.getSeconds());
    return d;
  };

  const getCombinedTo = (): Date => {
    const d = new Date(calRange?.to ?? toTime);
    d.setHours(toTime.getHours(), toTime.getMinutes(), toTime.getSeconds());
    return d;
  };

  // Apply button
  const handleApply = () => {
    if (calRange?.from && calRange?.to) {
      onChange?.({ from: getCombinedFrom(), to: getCombinedTo() });
    }
    setOpen(false);
  };

  // Format display text
  const formatDisplay = (d: Date) =>
    format(d, "MMM dd, yyyy - HH:mm:ss");

  const displayText =
    value?.from && value?.to
      ? `${formatDisplay(value.from)} → ${formatDisplay(value.to)}`
      : "Pick a date & time range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-xs transition-colors hover:bg-muted/50",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{displayText}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex flex-col">
          {/* Calendar */}
          <Calendar
            mode="range"
            defaultMonth={calRange?.from}
            selected={calRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
          />

          <Separator />

          {/* Time selectors */}
          <div className="flex items-end justify-between gap-4 p-3">
            <TimeInput
              label="Start time"
              value={fromTime}
              onChange={setFromTime}
            />
            <TimeInput
              label="End time"
              value={toTime}
              onChange={setToTime}
            />
            <Button size="sm" onClick={handleApply} className="ml-auto">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
