import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
  Signal,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePickerService } from './ngx-date-picker.service';
import { ButtonIconInput, CalendarDay, DisableWeekendsInput, SelectionMode } from './types/date-picker.types';
import { NEXT_ICON, PREVIOUS_ICON } from './constants/date-picker.const';

@Component({
  selector: 'ngx-date-picker',
  templateUrl: './ngx-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'calendar-host',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDatePickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class NgxDatePickerComponent implements ControlValueAccessor {
  private readonly datePickerService = inject(DatePickerService);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  // ControlValueAccessor callbacks
  private onChange: ((value: Date | Date[] | { start: Date; end: Date } | undefined) => void) | null = null;
  private onTouched: (() => void) | null = null;

  // Inputs
  selectionMode = input<SelectionMode>('single');
  disabledDates = input<Date[]>([]);
  minDate = input<Date | undefined>();
  maxDate = input<Date | undefined>();
  showOtherMonthDays = input(true);
  startOfWeek = input<0 | 1>(0); // 0 = Sunday, 1 = Monday
  highlightToday = input(true);
  allowPastDates = input(true);
  allowFutureDates = input(true);
  monthsToShow = input(1);
  disableWeekends = input<DisableWeekendsInput>(false);

  // Pre-selected dates (for syncing with parent component)
  preSelectedDate = input<Date | undefined>();
  preSelectedDates = input<Date[]>([]);
  preSelectedRange = input<{ start: Date; end: Date } | undefined>();

  // UI Inputs
  showTodayBtn = input<boolean>(true);
  showClearBtn = input<boolean>(true);
  preMonthTextBtn = input<string | boolean>(false);
  nextMonthBtnText = input<string | boolean>(false);
  preMonthBtnIcon = input<ButtonIconInput>(PREVIOUS_ICON);
  nextMonthBtnIcon = input<ButtonIconInput>(NEXT_ICON);
  customWeekdayNames = input<string[] | undefined>();

  previousIcon: Signal<SafeHtml | null> = computed(() => {
    if (!this.preMonthBtnIcon()) return null;
    return this.sanitizer.bypassSecurityTrustHtml(this.preMonthBtnIcon() as string)
  });
  nextIcon: Signal<SafeHtml | null> = computed(() => {
    if (!this.nextMonthBtnIcon()) return null;
    return this.sanitizer.bypassSecurityTrustHtml(this.nextMonthBtnIcon() as string)
  });

  // Outputs
  dateSelected = output<Date>();
  datesSelected = output<Date[]>();
  dateRangeSelected = output<{ start: Date; end: Date }>();
  clearSelection = output<void>();

  // Internal signals
  private currentDate = signal<Date>(new Date());
  private selectedDates = signal<Date[]>([]);
  private rangeStart = signal<Date | undefined>(undefined);
  private rangeEnd = signal<Date | undefined>(undefined);
  showMonthSelector = signal(false);
  showYearSelector = signal(false);

  // Computed signals
  currentMonth = computed(() => this.currentDate().getMonth());
  currentYear = computed(() => this.currentDate().getFullYear());
  monthName = computed(() =>
    this.datePickerService.getMonthName(this.currentMonth())
  );
  weekdayNames = computed(() => {
    const customNames = this.customWeekdayNames();

    // Validate custom weekday names if provided
    if (customNames !== undefined) {
      if (!Array.isArray(customNames)) {
        console.warn('customWeekdayNames must be an array');
        return this.getDefaultWeekdayNames();
      }
      if (customNames.length !== 7) {
        console.warn('customWeekdayNames must have exactly 7 elements');
        return this.getDefaultWeekdayNames();
      }
      if (!customNames.every((name) => typeof name === 'string')) {
        console.warn('customWeekdayNames must contain only strings');
        return this.getDefaultWeekdayNames();
      }

      const startOfWeek = this.startOfWeek();
      return startOfWeek === 0 ? customNames : [...customNames.slice(1), customNames[0]];
    }

    return this.getDefaultWeekdayNames();
  });

  private getDefaultWeekdayNames(): string[] {
    const names = this.datePickerService.getWeekdayNames();
    const startOfWeek = this.startOfWeek();
    return startOfWeek === 0 ? names : [...names.slice(1), names[0]];
  }

  monthNames = computed(() => this.datePickerService.getMonthNames());

  yearRange = computed(() => {
    const currentYear = this.currentYear();
    const years: number[] = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      years.push(i);
    }
    return years;
  });

  calendarDays = computed(() => {
    const disabledDates = this.getEffectiveDisabledDates();
    const selectedDates = this.selectedDates();
    const rangeStart = this.rangeStart();
    const rangeEnd = this.rangeEnd();

    return this.datePickerService.generateCalendarDays(
      this.currentYear(),
      this.currentMonth(),
      disabledDates,
      selectedDates,
      rangeStart !== undefined ? rangeStart : undefined,
      rangeEnd !== undefined ? rangeEnd : undefined
    );
  });

  displayedDays = computed(() => {
    const days = this.calendarDays();
    const showOtherMonths = this.showOtherMonthDays();

    if (showOtherMonths) {
      return days;
    }

    return days.filter((day) => day.isCurrentMonth);
  });

  constructor() {
    effect(() => {
      // React to input changes
      this.disabledDates();
      this.minDate();
      this.maxDate();
      this.allowPastDates();
      this.allowFutureDates();
      this.disableWeekends();
    });

    effect(() => {
      // Sync pre-selected dates from parent component
      const preSelectedDate = this.preSelectedDate();
      const preSelectedDates = this.preSelectedDates();
      const preSelectedRange = this.preSelectedRange();

      if (preSelectedDate) {
        this.selectedDates.set([preSelectedDate]);
        this.rangeStart.set(undefined);
        this.rangeEnd.set(undefined);
      } else if (preSelectedDates && preSelectedDates.length > 0) {
        this.selectedDates.set(preSelectedDates);
        this.rangeStart.set(undefined);
        this.rangeEnd.set(undefined);
      } else if (preSelectedRange) {
        this.selectedDates.set(this.datePickerService.getDateRange(preSelectedRange.start, preSelectedRange.end));
        this.rangeStart.set(preSelectedRange.start);
        this.rangeEnd.set(preSelectedRange.end);
      }
    });

    // Sync form control value when internal state changes
    effect(() => {
      const mode = this.selectionMode();
      let value: Date | Date[] | { start: Date; end: Date } | undefined;

      if (mode === 'single') {
        const dates = this.selectedDates();
        value = dates.length > 0 ? dates[0] : undefined;
      } else if (mode === 'multiple') {
        value = this.selectedDates();
      } else if (mode === 'range') {
        const start = this.rangeStart();
        const end = this.rangeEnd();
        value = start && end ? { start, end } : undefined;
      }

      if (this.onChange) {
        this.onChange(value);
      }
    });
  }

  /**
   * Convert disableWeekends input to array of day numbers (0-6)
   * - false: no weekends disabled
   * - true: disable both Saturday (6) and Sunday (0)
   * - 1: disable only Sunday (0)
   * - 2: disable Saturday (6) and Sunday (0)
   * - [0]: disable Sunday
   * - [6]: disable Saturday
   * - [0, 6]: disable both
   */
  private getDisabledWeekendDays(): number[] {
    const input = this.disableWeekends();

    if (input === false) {
      return [];
    }

    if (input === true) {
      return [0, 6]; // Sunday and Saturday
    }

    if (typeof input === 'number') {
      if (input === 1) {
        return [0]; // Sunday only
      }
      if (input === 2) {
        return [0, 6]; // Sunday and Saturday
      }
      return [];
    }

    if (Array.isArray(input)) {
      // Filter to only valid day numbers (0-6)
      return input.filter((day) => typeof day === 'number' && day >= 0 && day <= 6);
    }

    return [];
  }

  /**
   * Get effective disabled dates combining input and computed disabled dates
   */
  private getEffectiveDisabledDates(): Date[] {
    const disabled = [...this.disabledDates()];
    const min = this.minDate();
    const max = this.maxDate();
    const allowPast = this.allowPastDates();
    const allowFuture = this.allowFutureDates();
    const disableWeekends = this.disableWeekends();

    // Add dates outside min/max range
    if (min || max) {
      const currentDate = new Date(this.currentYear(), this.currentMonth(), 1);
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      if (min) {
        for (let d = new Date(monthStart); d < min && d <= monthEnd; d.setDate(d.getDate() + 1)) {
          disabled.push(new Date(d));
        }
      }

      if (max) {
        for (let d = new Date(max); d.setDate(d.getDate() + 1), d <= monthEnd;) {
          disabled.push(new Date(d));
        }
      }
    }

    // Add past dates if not allowed
    if (!allowPast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = new Date(this.currentYear(), this.currentMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      for (let d = new Date(currentDate); d < today && d <= monthEnd; d.setDate(d.getDate() + 1)) {
        disabled.push(new Date(d));
      }
    }

    // Add future dates if not allowed
    if (!allowFuture) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() + 1);
      const currentDate = new Date(this.currentYear(), this.currentMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      for (let d = new Date(today); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        disabled.push(new Date(d));
      }
    }

    // Add weekends if disabled
    const disabledWeekendDays = this.getDisabledWeekendDays();
    if (disabledWeekendDays.length > 0) {
      const currentDate = new Date(this.currentYear(), this.currentMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      for (let d = new Date(currentDate); d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (disabledWeekendDays.includes(dayOfWeek)) {
          disabled.push(new Date(d));
        }
      }
    }

    return disabled;
  }

  /**
   * Handle day click
   */
  onDayClick(day: CalendarDay): void {
    if (day.isDisabled || !day.isCurrentMonth) {
      return;
    }

    const mode = this.selectionMode();

    if (mode === 'single') {
      this.selectedDates.set([day.date]);
      this.rangeStart.set(undefined);
      this.rangeEnd.set(undefined);
      this.dateSelected.emit(day.date);
      this.markAsTouched();
    } else if (mode === 'multiple') {
      const dates = [...this.selectedDates()];
      const index = dates.findIndex((d) => this.datePickerService.isSameDay(d, day.date));

      if (index > -1) {
        dates.splice(index, 1);
      } else {
        dates.push(day.date);
      }

      this.selectedDates.set(dates);
      this.datesSelected.emit(dates);
      this.markAsTouched();
    } else if (mode === 'range') {
      const start = this.rangeStart();
      const end = this.rangeEnd();

      if (!start) {
        this.rangeStart.set(day.date);
        this.selectedDates.set([day.date]);
      } else if (!end) {
        if (day.date < start) {
          this.rangeStart.set(day.date);
          this.rangeEnd.set(start);
        } else {
          this.rangeEnd.set(day.date);
        }

        const range = this.datePickerService.getDateRange(
          this.rangeStart()!,
          this.rangeEnd()!
        );
        this.selectedDates.set(range);
        this.dateRangeSelected.emit({
          start: this.rangeStart()!,
          end: this.rangeEnd()!,
        });
        this.markAsTouched();
      } else {
        this.rangeStart.set(day.date);
        this.rangeEnd.set(undefined);
        this.selectedDates.set([day.date]);
      }
    }
  }

  /**
   * Navigate to previous month
   */
  previousMonth(): void {
    this.currentDate.set(this.datePickerService.subtractMonths(this.currentDate(), 1));
  }

  /**
   * Navigate to next month
   */
  nextMonth(): void {
    this.currentDate.set(this.datePickerService.addMonths(this.currentDate(), 1));
  }

  /**
   * Go to today
   */
  goToToday(): void {
    this.currentDate.set(new Date());
  }

  /**
   * Clear selection
   */
  onClearSelection(): void {
    this.selectedDates.set([]);
    this.rangeStart.set(undefined);
    this.rangeEnd.set(undefined);
    this.clearSelection.emit();
  }

  /**
   * Toggle month selector
   */
  toggleMonthSelector(): void {
    this.showMonthSelector.set(!this.showMonthSelector());
    this.showYearSelector.set(false);
  }

  /**
   * Toggle year selector
   */
  toggleYearSelector(): void {
    this.showYearSelector.set(!this.showYearSelector());
    this.showMonthSelector.set(false);

    // Scroll to selected year after a short delay to ensure DOM is rendered
    if (!this.showYearSelector()) return;
    setTimeout(() => this.scrollToSelectedYear(), 0);
  }

  /**
   * Scroll year selector to show the selected year
   */
  private scrollToSelectedYear(): void {
    const yearGrid = document.querySelector('.selector-grid-large');
    if (!yearGrid) return;

    const selectedButton = yearGrid.querySelector('[aria-pressed="true"]') as HTMLElement;
    if (!selectedButton) return;

    // Scroll the selected year into view
    selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Select a specific month
   */
  selectMonth(month: number): void {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(month);
    this.currentDate.set(newDate);
    this.showMonthSelector.set(false);
  }

  /**
   * Select a specific year
   */
  selectYear(year: number): void {
    const newDate = new Date(this.currentDate());
    newDate.setFullYear(year);
    this.currentDate.set(newDate);
    this.showYearSelector.set(false);
  }

  /**
   * Get CSS class for a day
   */
  getDayClass(day: CalendarDay): string {
    const classes: string[] = ['calendar-day'];

    if (!day.isCurrentMonth && !this.showOtherMonthDays()) {
      classes.push('hidden');
    }

    if (day.isCurrentMonth) {
      classes.push('current-month');
    }

    if (day.isToday && this.highlightToday()) {
      classes.push('today');
    }

    if (day.isDisabled) {
      classes.push('disabled');
    }

    if (day.isSelected) {
      classes.push('selected');
    }

    if (day.isInRange) {
      classes.push('in-range');
    }

    if (day.isSelected && this.selectionMode() === 'range') {
      const start = this.rangeStart();
      const end = this.rangeEnd();
      if (start && this.datePickerService.isSameDay(day.date, start)) {
        classes.push('range-start');
      }
      if (end && this.datePickerService.isSameDay(day.date, end)) {
        classes.push('range-end');
      }
    }

    return classes.join(' ');
  }

  /**
   * Check if a day should be hidden
   */
  shouldHideDayNumber(day: CalendarDay): boolean {
    return !day.isCurrentMonth && !this.showOtherMonthDays();
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | Date[] | { start: Date; end: Date } | undefined): void {
    if (value === null || value === undefined) {
      this.selectedDates.set([]);
      this.rangeStart.set(undefined);
      this.rangeEnd.set(undefined);
      return;
    }

    const mode = this.selectionMode();

    if (mode === 'single' && value instanceof Date) {
      this.selectedDates.set([value]);
    } else if (mode === 'multiple' && Array.isArray(value)) {
      this.selectedDates.set(value);
    } else if (mode === 'range' && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.rangeStart.set((value as { start: Date; end: Date }).start);
      this.rangeEnd.set((value as { start: Date; end: Date }).end);
    }
  }

  registerOnChange(fn: (value: Date | Date[] | { start: Date; end: Date } | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Note: The disabled input is already handled by the input() function
    // This method is here for ControlValueAccessor compliance
  }

  markAsTouched(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }
}
