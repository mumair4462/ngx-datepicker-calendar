export type DateFormatType = 'short' | 'medium' | 'long' | 'full' | 'custom';
export type SelectionMode = 'single' | 'multiple' | 'range';
export type DisableWeekendsInput = boolean | number | number[];
export type ButtonIconInput = string | boolean;

export interface IDateFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'short' | 'long' | 'narrow';
  day?: 'numeric' | '2-digit';
  weekday?: 'short' | 'long' | 'narrow';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
}

export interface ICalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isInRange: boolean;
}

export interface ICalendarMonth {
  year: number;
  month: number;
  days: ICalendarDay[];
}

export interface IDateRange { 
  start: Date; 
  end: Date 
}