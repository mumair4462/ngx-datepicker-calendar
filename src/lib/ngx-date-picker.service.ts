import { Injectable } from '@angular/core';
import { CalendarDay } from '../public-api';

@Injectable({
  providedIn: 'root',
})
export class DatePickerService {
  private readonly MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  private readonly WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /**
   * Get the month name
   */
  getMonthName(month: number): string {
    return this.MONTHS[month] || '';
  }

  /**
   * Get all month names
   */
  getMonthNames(): string[] {
    return [...this.MONTHS];
  }

  /**
   * Get all weekday names
   */
  getWeekdayNames(): string[] {
    return [...this.WEEKDAYS];
  }

  /**
   * Generate calendar days for a given month
   */
  generateCalendarDays(
    year: number,
    month: number,
    disabledDates: Date[] = [],
    selectedDates: Date[] = [],
    rangeStart?: Date,
    rangeEnd?: Date
  ): CalendarDay[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize dates for comparison
    const normalizedDisabledDates = disabledDates.map((d) => this.normalizeDate(d));
    const normalizedSelectedDates = selectedDates.map((d) => this.normalizeDate(d));
    const normalizedRangeStart = rangeStart ? this.normalizeDate(rangeStart) : undefined;
    const normalizedRangeEnd = rangeEnd ? this.normalizeDate(rangeEnd) : undefined;

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const normalizedCurrentDate = this.normalizeDate(currentDate);

      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = this.isSameDay(normalizedCurrentDate, today);
      const isDisabled = normalizedDisabledDates.some((d) => this.isSameDay(d, normalizedCurrentDate));
      const isSelected = normalizedSelectedDates.some((d) => this.isSameDay(d, normalizedCurrentDate));
      const isInRange = this.isDateInRange(
        normalizedCurrentDate,
        normalizedRangeStart,
        normalizedRangeEnd
      );

      days.push({
        date: currentDate,
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth,
        isToday,
        isDisabled,
        isSelected,
        isInRange,
      });
    }

    return days;
  }

  /**
   * Check if two dates are the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Normalize a date to midnight UTC
   */
  normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  /**
   * Check if a date is within a range
   */
  private isDateInRange(date: Date, start?: Date, end?: Date): boolean {
    if (!start || !end) return false;
    return date >= start && date <= end;
  }

  /**
   * Get the number of days in a month
   */
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  /**
   * Add months to a date
   */
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Subtract months from a date
   */
  subtractMonths(date: Date, months: number): Date {
    return this.addMonths(date, -months);
  }

  /**
   * Check if a date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  /**
   * Check if a date is in the past
   */
  isPast(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalized = this.normalizeDate(date);
    return normalized < today;
  }

  /**
   * Check if a date is in the future
   */
  isFuture(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalized = this.normalizeDate(date);
    return normalized > today;
  }

  /**
   * Get date range between two dates
   */
  getDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  /**
   * Format date to string
   */
  formatDate(date: Date, format: string = 'MM/DD/YYYY'): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString());
  }
}
