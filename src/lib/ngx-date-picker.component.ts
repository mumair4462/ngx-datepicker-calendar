import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  output,
  forwardRef,
  effect,
  inject,
  Signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxCalendarComponent } from './ngx-calendar.component';
import { IDateFormatOptions, DateFormatType, SelectionMode, ButtonIconInput, DisableWeekendsInput, IDateRange } from './types/date-picker-calendar.types';
import { NEXT_ICON, PREVIOUS_ICON } from './constants/date-picker.const';

@Component({
  selector: 'ngx-date-picker',
  templateUrl: './ngx-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDatePickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [ReactiveFormsModule, NgxCalendarComponent],
})
export class NgxDatePickerComponent implements ControlValueAccessor {
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  // Inputs
  selectionMode = input<SelectionMode>('single');
  placeholder = input('Select a date');
  dateSeparator = input('|');
  disabled = input(false);
  disabledDates = input<Date[]>([]);
  minDate = input<Date | undefined>();
  maxDate = input<Date | undefined>();
  showOtherMonthDays = input(true);
  highlightToday = input(true);
  allowPastDates = input(true);
  allowFutureDates = input(true);
  disableWeekends = input<DisableWeekendsInput>(false);
  customWeekdayNames = input<string[] | undefined>();
  dateFormat = input<DateFormatType>('medium');
  customDateFormatOptions = input<IDateFormatOptions | undefined>();
  
  // Additional calendar inputs from NgxCalendarComponent
  startOfWeek = input<0 | 1>(0); // 0 = Sunday, 1 = Monday
  monthsToShow = input(1);
  
  // Pre-selected dates (for syncing with parent component)
  preSelectedDate = input<Date | undefined>();
  preSelectedDates = input<Date[]>([]);
  preSelectedRange = input<IDateRange | undefined>();
  
  // UI Inputs
  showTodayBtn = input<boolean>(true);
  showClearBtn = input<boolean>(true);
  preMonthTextBtn = input<string | boolean>(false);
  nextMonthBtnText = input<string | boolean>(false);
  preMonthBtnIcon = input<ButtonIconInput>(PREVIOUS_ICON);
  nextMonthBtnIcon = input<ButtonIconInput>(NEXT_ICON);

  // Computed icon signals
  previousIcon: Signal<SafeHtml | null> = computed(() => {
    if (!this.preMonthBtnIcon()) return null;
    return this.sanitizer.bypassSecurityTrustHtml(this.preMonthBtnIcon() as string);
  });
  
  nextIcon: Signal<SafeHtml | null> = computed(() => {
    if (!this.nextMonthBtnIcon()) return null;
    return this.sanitizer.bypassSecurityTrustHtml(this.nextMonthBtnIcon() as string);
  });

  // Outputs
  dateSelected = output<Date>();
  datesSelected = output<Date[]>();
  dateRangeSelected = output<IDateRange>();
  onClearSelection = output<void>();

  // Internal signals
  selectedDate = signal<Date | undefined>(undefined);
  selectedDates = signal<Date[]>([]);
  selectedRange = signal<IDateRange | undefined>(undefined);
  isOpen = signal(false);

  // ControlValueAccessor callbacks
  private onChange: ((value: Date | Date[] | IDateRange | undefined) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    // Sync form control value when internal state changes
    effect(() => {
      const mode = this.selectionMode();
      let value: Date | Date[] | IDateRange | undefined;

      if (mode === 'single') {
        value = this.selectedDate();
      } else if (mode === 'multiple') {
        value = this.selectedDates();
      } else if (mode === 'range') {
        value = this.selectedRange();
      }

      if (this.onChange) {
        this.onChange(value);
      }
    });
  }

  // Computed display value
  displayValue = computed(() => {
    const mode = this.selectionMode();

    if (mode === 'single') {
      const date = this.selectedDate();
      return date ? this.formatDate(date) : '';
    } else if (mode === 'multiple') {
      const dates = this.selectedDates();
      return dates.length > 0 ? `${dates.map((date) => this.formatDate(date)).join(` ${this.dateSeparator()} `)}` : '';
    } else if (mode === 'range') {
      const range = this.selectedRange();
      return range ? `${this.formatDate(range.start)} - ${this.formatDate(range.end)}` : '';
    }

    return '';
  });

  openPopover(): void {
    if (!this.disabled()) {
      this.isOpen.set(true);
    }
  }

  closePopover(): void {
    this.isOpen.set(false);
  }

  togglePopover(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
    this.dateSelected.emit(date);
    this.markAsTouched();
    this.closePopover();
  }

  onDatesSelected(dates: Date[]): void {
    this.selectedDates.set(dates);
    this.datesSelected.emit(dates);
    this.markAsTouched();
  }

  onDateRangeSelected(range: IDateRange): void {
    this.selectedRange.set(range);
    this.dateRangeSelected.emit(range);
    this.markAsTouched();
    this.closePopover();
  }

  private formatDate(date: Date): string {
    const format = this.dateFormat();
    const customOptions = this.customDateFormatOptions();

    // If custom options are provided, use them
    if (customOptions) {
      return date.toLocaleDateString('en-US', customOptions);
    }

    // Use predefined format types
    const formatOptions: Record<DateFormatType, Intl.DateTimeFormatOptions> = {
      short: {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      },
      medium: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      full: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      custom: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    };

    const options = formatOptions[format] || formatOptions.medium;
    return date.toLocaleDateString('en-US', options);
  }

  clearSelection(): void {
    this.selectedDate.set(undefined);
    this.selectedDates.set([]);
    this.selectedRange.set(undefined);
    this.dateSelected.emit(undefined as any);
    this.datesSelected.emit([]);
    this.dateRangeSelected.emit(undefined as any);
    this.onClearSelection.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | Date[] | IDateRange | undefined): void {
    if (value === null || value === undefined) {
      this.clearSelection();
      return;
    }

    const mode = this.selectionMode();

    if (mode === 'single' && value instanceof Date) {
      this.selectedDate.set(value);
    } else if (mode === 'multiple' && Array.isArray(value)) {
      this.selectedDates.set(value);
    } else if (mode === 'range' && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.selectedRange.set(value as IDateRange);
    }
  }

  registerOnChange(fn: (value: Date | Date[] | IDateRange | undefined) => void): void {
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
