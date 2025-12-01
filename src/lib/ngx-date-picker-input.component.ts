import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  output,
  forwardRef,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgxDatePickerComponent } from './ngx-date-picker.component';
import { IDateFormatOptions, DateFormatType, SelectionMode } from './types/date-picker.types';

@Component({
  selector: 'ngx-date-picker-input',
  templateUrl: './ngx-date-picker-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDatePickerInputComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [ReactiveFormsModule, NgxDatePickerComponent],
})
export class NgxDatePickerInputComponent implements ControlValueAccessor {
  // Inputs
  selectionMode = input<SelectionMode>('single');
  placeholder = input('Select a date');
  dateSeparator = input(' | ');
  disabled = input(false);
  disabledDates = input<Date[]>([]);
  minDate = input<Date | undefined>();
  maxDate = input<Date | undefined>();
  showOtherMonthDays = input(true);
  highlightToday = input(true);
  allowPastDates = input(true);
  allowFutureDates = input(true);
  disableWeekends = input(false);
  customWeekdayNames = input<string[] | undefined>();
  dateFormat = input<DateFormatType>('medium');
  customDateFormatOptions = input<IDateFormatOptions | undefined>();

  // Outputs
  dateSelected = output<Date>();
  datesSelected = output<Date[]>();
  dateRangeSelected = output<{ start: Date; end: Date }>();

  // Internal signals
  selectedDate = signal<Date | undefined>(undefined);
  selectedDates = signal<Date[]>([]);
  selectedRange = signal<{ start: Date; end: Date } | undefined>(undefined);
  isOpen = signal(false);

  // ControlValueAccessor callbacks
  private onChange: ((value: Date | Date[] | { start: Date; end: Date } | undefined) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    // Sync form control value when internal state changes
    effect(() => {
      const mode = this.selectionMode();
      let value: Date | Date[] | { start: Date; end: Date } | undefined;

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
      return dates.length > 0 ? `${dates.map((date) => this.formatDate(date)).join(`${this.dateSeparator()}`)}` : '';
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

  onDateRangeSelected(range: { start: Date; end: Date }): void {
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
  }

  // ControlValueAccessor implementation
  writeValue(value: Date | Date[] | { start: Date; end: Date } | undefined): void {
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
      this.selectedRange.set(value as { start: Date; end: Date });
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
