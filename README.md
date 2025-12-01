# ngx-datepicker-calendar - Complete Documentation

A fully-featured, accessible, and performant date picker component library built with Angular v18+ using signals and standalone components. Includes both a standalone `NgxCalendarComponent` and a wrapped `NgxDatePickerComponent` for easy integration.

---

## Table of Contents

1. [Features](#features)
2. [Version Compatibility](#version-compatibility)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [Setup & Configuration](#setup--configuration)
6. [Styling & Theming](#styling--theming)
7. [Calendar Component](#calendar-component)
8. [Calendar Input Component](#calendar-input-component)
9. [Input Properties Reference](#input-properties-reference)
10. [Output Events Reference](#output-events-reference)
11. [CSS Variables & Styling](#css-variables--styling)
12. [Best Practices](#best-practices)
13. [Examples](#examples)
14. [Accessibility](#accessibility)
15. [FAQ](#faq)

---

## Features

### Selection Modes
- **Single Date** - Select one date
- **Multiple Dates** - Select multiple individual dates
- **Date Range** - Select a start and end date

### Date Management
- Disabled dates support
- Min/Max date range constraints
- Disable past/future dates
- Disable specific weekends (customizable)
- Highlight today's date
- Show/hide other month days

### Customization
- Custom weekday names (e.g., 'S', 'Su', 'Sun', or other languages)
- Custom month/year button text and icons
- Show/hide action buttons (Today, Clear)
- Configurable week start day (Sunday or Monday)

### UI/UX
- Modern, clean design
- Responsive layout
- Dark mode support
- Smooth animations and transitions
- Keyboard navigation support
- Month/Year selector dropdowns

### Performance
- Built with Angular signals for optimal change detection
- OnPush change detection strategy
- Computed properties for derived state
- No unnecessary re-renders

### Accessibility
- **WCAG AA compliant**
- **Proper ARIA labels and attributes**
- **Focus management**
- **Keyboard accessible**
- **Screen reader friendly**

---

## Version Compatibility

### Supported Versions

| ngx-datepicker-calendar | Angular Version |
|-------------------------|-----------------|
| **1.x.x**               | **18.x.x**      |

---

## Installation

### NPM Installation

Install the package using npm:

```bash
npm install ngx-datepicker-calendar
```

Or using yarn:

```bash
yarn add ngx-datepicker-calendar
```

Or using pnpm:

```bash
pnpm add ngx-datepicker-calendar
```

### Verify Installation

After installation, verify the package is installed correctly:

```bash
npm list ngx-datepicker-calendar
```

---

## Quick Start

### 1. Import the Component

In your component file, import the date picker component:

```typescript
import { Component } from '@angular/core';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxDatePickerComponent],
  template: `
    <ngx-date-picker
      selectionMode="single"
      placeholder="Select a date"
      (dateSelected)="onDateSelected($event)"
    />
  `
})
export class AppComponent {
  onDateSelected(date: Date) {
    console.log('Selected date:', date);
  }
}
```

### 2. Add Styling

Import the CSS files in your global `styles.scss` or `styles.css`:

```scss
@import 'ngx-datepicker-calendar/lib/theme/date-picker.css';
@import 'ngx-datepicker-calendar/lib/theme/calendar.css';

// Optional: Dark theme
@import 'ngx-datepicker-calendar/lib/theme/date-picker-calendar-dark.css';
```

Or in your `styles.css`:

```css
@import 'ngx-datepicker-calendar/lib/theme/date-picker.css';
@import 'ngx-datepicker-calendar/lib/theme/calendar.css';

/* Optional: Dark theme */
@import 'ngx-datepicker-calendar/lib/theme/date-picker-calendar-dark.css';
```

### 3. Use in Your Application

```typescript
import { Component, signal } from '@angular/core';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-date-picker-example',
  standalone: true,
  imports: [NgxDatePickerComponent],
  template: `
    <div>
      <label for="date-input">Select a Date:</label>
      <ngx-date-picker
        id="date-input"
        selectionMode="single"
        placeholder="Pick a date"
        (dateSelected)="selectedDate.set($event)"
      />
      @if (selectedDate()) {
        <p>You selected: {{ selectedDate() | date: 'fullDate' }}</p>
      }
    </div>
  `
})
export class DatePickerExampleComponent {
  selectedDate = signal<Date | undefined>(undefined);
}
```

---

## Setup & Configuration

### Import Components

Both components are standalone and can be imported directly:

```typescript
import { NgxCalendarComponent, NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxCalendarComponent, NgxDatePickerComponent],
  template: `...`
})
export class AppComponent {}
```

### Module Setup (if not using standalone)

```typescript
import { NgModule } from '@angular/core';
import { NgxCalendarComponent, NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@NgModule({
  imports: [NgxCalendarComponent, NgxDatePickerComponent]
})
export class DatePickerModule {}
```

---

## Styling & Theming

### Global Styling Setup

The ngx-datepicker-calendar library includes pre-built CSS themes. Add them to your global styles file:

#### Option 1: SCSS (Recommended)

In your `src/styles.scss`:

```scss
@import 'ngx-datepicker-calendar/lib/theme/date-picker.css';
@import 'ngx-datepicker-calendar/lib/theme/calendar.css';

// Optional: Include dark theme
@import 'ngx-datepicker-calendar/lib/theme/date-picker-calendar-dark.css';

// Your custom variables and styles
:root {
  --input-color-primary: #4a90e2;
  --input-border-radius-md: 8px;
}
```

#### Option 2: CSS

In your `src/styles.css`:

```css
@import 'ngx-datepicker-calendar/lib/theme/date-picker.css';
@import 'ngx-datepicker-calendar/lib/theme/calendar.css';

/* Optional: Include dark theme */
@import 'ngx-datepicker-calendar/lib/theme/date-picker-calendar-dark.css';

/* Your custom variables and styles */
:root {
  --input-color-primary: #4a90e2;
  --input-border-radius-md: 8px;
}
```

#### Option 3: Angular CLI Configuration

In `angular.json`, add the CSS files to the `styles` array:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "node_modules/ngx-datepicker-calendar/lib/theme/date-picker.css",
              "node_modules/ngx-datepicker-calendar/lib/theme/calendar.css",
              "node_modules/ngx-datepicker-calendar/lib/theme/date-picker-calendar-dark.css"
            ]
          }
        }
      }
    }
  }
}
```

### Dark Mode Support

The library includes built-in dark mode support. To enable dark mode:

#### Automatic (System Preference)

The dark theme automatically activates based on the user's system preference:

```scss
@import 'ngx-datepicker-calendar/lib/theme/date-picker-calendar-dark.css';

@media (prefers-color-scheme: dark) {
  // Dark mode styles are automatically applied
}
```

#### Manual Dark Mode Toggle

To manually control dark mode, add a class to your root element:

```typescript
// In your component or service
export class ThemeService {
  toggleDarkMode() {
    document.documentElement.classList.toggle('dark-mode');
  }
}
```

Then in your CSS:

```css
@import 'ngx-datepicker-calendar/lib/theme/date-picker-calendar-dark.css';

:root.dark-mode {
  --input-color-background: #1e1e1e;
  --input-color-text-primary: #e0e0e0;
  /* ... more dark mode variables */
}
```

### Theme Files Included

- **`date-picker.css`** - Main calendar component styles
- **`date-picker-input.css`** - Input field and popover styles
- **`date-picker-dark.css`** - Dark mode theme overrides

---

## Calendar Component

The core calendar component that displays the calendar grid and handles date selection.

### Basic Usage

```html
<ngx-calendar
  selectionMode="single"
  (dateSelected)="onDateSelected($event)"
/>
```

### Single Date Selection

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { NgxCalendarComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-example',
  template: `
    <ngx-calendar
      selectionMode="single"
      (dateSelected)="onDateSelected($event)"
    />
    @if (selectedDate()) {
      <p>Selected: {{ selectedDate() | date }}</p>
    }
  `,
  imports: [NgxCalendarComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  selectedDate = signal<Date | undefined>(undefined);

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
  }
}
```

### Multiple Dates Selection

```html
<ngx-calendar
  selectionMode="multiple"
  (datesSelected)="onDatesSelected($event)"
/>
```

```typescript
onDatesSelected(dates: Date[]): void {
  console.log('Selected dates:', dates);
}
```

### Date Range Selection

```html
<ngx-calendar
  selectionMode="range"
  (dateRangeSelected)="onDateRangeSelected($event)"
/>
```

```typescript
onDateRangeSelected(range: { start: Date; end: Date }): void {
  console.log('Range:', range.start, 'to', range.end);
}
```

---

## Calendar Input Component

A wrapper around the Calendar component that includes a text input field and popover. Perfect for form integration.

### Basic Usage

```html
<ngx-date-picker
  selectionMode="single"
  placeholder="Select a date"
  (dateSelected)="onDateSelected($event)"
/>
```

### With Multiple Selection

```html
<ngx-date-picker
  selectionMode="multiple"
  placeholder="Select dates"
  [dateSeparator]="' | '"
  (datesSelected)="onDatesSelected($event)"
/>
```

### With Date Range

```html
<ngx-date-picker
  selectionMode="range"
  placeholder="Select date range"
  (dateRangeSelected)="onDateRangeSelected($event)"
/>
```

### Form Integration

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="form">
      <ngx-date-picker
        formControlName="dateRange"
        selectionMode="range"
        placeholder="Select date range"
      />
      <button (click)="submit()">Submit</button>
    </form>
  `,
  imports: [NgxDatePickerComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    dateRange: [undefined, Validators.required]
  });

  submit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## Input Properties Reference

### Calendar Component Inputs

#### Selection & Display

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `selectionMode` | `'single' \| 'multiple' \| 'range'` | `'single'` | Date selection mode |
| `showOtherMonthDays` | `boolean` | `true` | Show days from other months in the grid |
| `startOfWeek` | `0 \| 1` | `0` | Week start day (0=Sunday, 1=Monday) |
| `highlightToday` | `boolean` | `true` | Highlight today's date with special styling |
| `monthsToShow` | `number` | `1` | Number of months to display (future feature) |

#### Date Constraints

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabledDates` | `Date[]` | `[]` | Array of dates to disable |
| `minDate` | `Date \| undefined` | `undefined` | Minimum selectable date (inclusive) |
| `maxDate` | `Date \| undefined` | `undefined` | Maximum selectable date (inclusive) |
| `allowPastDates` | `boolean` | `true` | Allow selection of dates before today |
| `allowFutureDates` | `boolean` | `true` | Allow selection of dates after today |
| `disableWeekends` | `boolean \| number \| number[]` | `false` | Disable weekend dates. Options: `true` (both), `1` (Sunday), `2` (Sat+Sun), `[0, 6]` (custom) |

#### UI Customization

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showTodayBtn` | `boolean` | `true` | Show "Today" button |
| `showClearBtn` | `boolean` | `true` | Show "Clear" button |
| `preMonthTextBtn` | `string \| boolean` | `false` | Previous month button text (false = use icon) |
| `nextMonthBtnText` | `string \| boolean` | `false` | Next month button text (false = use icon) |
| `preMonthBtnIcon` | `string \| boolean` | SVG icon | Previous month button icon (SVG string) |
| `nextMonthBtnIcon` | `string \| boolean` | SVG icon | Next month button icon (SVG string) |
| `customWeekdayNames` | `string[] \| undefined` | `undefined` | Custom weekday names (must be exactly 7 strings) |

### Calendar Input Component Inputs

All Calendar inputs plus:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | `string` | `'Select a date'` | Input field placeholder text |
| `dateSeparator` | `string` | `' \| '` | Separator for multiple dates display |
| `disabled` | `boolean` | `false` | Disable the input field |
| `dateFormat` | `'short' \| 'medium' \| 'long' \| 'full' \| 'custom'` | `'medium'` | Predefined date format type |
| `customDateFormatOptions` | `DateFormatOptions \| undefined` | `undefined` | Custom date formatting options (overrides `dateFormat`) |

#### Date Format Types

- **`short`**: `12/25/24` (2-digit year, month, day)
- **`medium`**: `Dec 25, 2024` (default - short month name)
- **`long`**: `December 25, 2024` (full month name)
- **`full`**: `Monday, December 25, 2024` (includes weekday)
- **`custom`**: Use `customDateFormatOptions` for full control

#### DateFormatOptions Interface

```typescript
interface DateFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'short' | 'long' | 'narrow';
  day?: 'numeric' | '2-digit';
  weekday?: 'short' | 'long' | 'narrow';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
}
```

---

## Output Events Reference

### Calendar Component Outputs

#### Single Selection Mode
```typescript
@Output() dateSelected = output<Date>();
```
Emitted when a single date is selected.

#### Multiple Selection Mode
```typescript
@Output() datesSelected = output<Date[]>();
```
Emitted when dates are selected or deselected.

#### Range Selection Mode
```typescript
@Output() dateRangeSelected = output<{ start: Date; end: Date }>();
```
Emitted when a date range is fully selected (both start and end dates chosen).

#### Clear Selection
```typescript
@Output() clearSelection = output<void>();
```
Emitted when the clear button is clicked.

### Calendar Input Component Outputs

Same as Calendar component (all events are passed through).

---

## CSS Variables & Styling

### Available CSS Variables

The Calendar Input component uses CSS custom properties for full customization. Override these in your global styles or component styles:

#### Color Variables

```css
:root {
  --input-color-primary: #4a90e2;
  --input-color-primary-light: #e3f2fd;
  --input-color-text-primary: #333;
  --input-color-text-secondary: #666;
  --input-color-text-light: #999;
  --input-color-text-muted: #ccc;
  --input-color-background: #ffffff;
  --input-color-background-light: #f5f5f5;
  --input-color-background-lighter: #fafafa;
  --input-color-border: #e0e0e0;
  --input-color-border-light: #ddd;
  --input-color-shadow: rgba(0, 0, 0, 0.1);
  --input-color-overlay: rgba(0, 0, 0, 0.5);
}
```

#### Spacing Variables

```css
:root {
  --input-spacing-xs: 4px;
  --input-spacing-sm: 8px;
  --input-spacing-md: 12px;
  --input-spacing-lg: 16px;
  --input-spacing-xl: 20px;
  --input-spacing-2xl: 30px;
}
```

#### Padding Variables

```css
:root {
  --input-padding: 12px 16px;
  --input-padding-button: 8px 12px;
  --input-padding-container: 16px;
}
```

#### Border Radius Variables

```css
:root {
  --input-border-radius-sm: 4px;
  --input-border-radius-md: 8px;
}
```

#### Typography Variables

```css
:root {
  /* Font sizes */
  --input-font-size-xs: 11px;
  --input-font-size-sm: 12px;
  --input-font-size-base: 16px;
  --input-font-size-md: 18px;
  --input-font-size-lg: 20px;

  /* Font weights */
  --input-font-weight-normal: 500;
  --input-font-weight-semibold: 600;
  --input-font-weight-bold: 700;
}
```

#### Transition & Z-index Variables

```css
:root {
  --input-transition-default: all 0.2s ease;
  --input-transition-none: none;
  --input-z-index-overlay: 1000;
  --input-z-index-popover: 1001;
}
```

#### Input Field Variables

```css
:root {
  --calendar-input-height: 48px;
  --calendar-input-min-width: 280px;
  --calendar-input-padding: 12px 16px;
  --calendar-input-border: 1px solid var(--input-color-border);
  --calendar-input-border-radius: 8px;
  --calendar-input-font-size: var(--input-font-size-base);
  --calendar-input-color: var(--input-color-text-primary);
  --calendar-input-background: var(--input-color-background);
  --calendar-input-box-shadow: 0 2px 8px var(--input-color-shadow);
  --calendar-input-focus-border-color: var(--input-color-primary);
  --calendar-input-focus-shadow: 0 0 0 3px var(--input-color-primary-light);
  --calendar-input-disabled-background: var(--input-color-background-light);
  --calendar-input-disabled-color: var(--input-color-text-muted);
  --calendar-input-disabled-opacity: 0.6;
  --calendar-input-placeholder-color: var(--input-color-text-light);
}
```

#### Popover Variables

```css
:root {
  --popover-background: var(--input-color-background);
  --popover-border: 1px solid var(--input-color-border);
  --popover-border-radius: 8px;
  --popover-shadow: 0 2px 8px var(--input-color-shadow);
  --popover-z-index: var(--input-z-index-popover);
  --popover-offset-top: 12px;
  --popover-arrow-size: 8px;
  --popover-arrow-color: var(--input-color-border);
  --popover-arrow-inner-color: var(--input-color-background);
}
```

#### Overlay Variables

```css
:root {
  --overlay-background: transparent;
  --overlay-z-index: var(--input-z-index-overlay);
}
```

### Dark Mode Support

The component automatically adapts to dark mode. Override these variables in dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --input-color-dark-background: #1e1e1e;
    --input-color-dark-background-secondary: #2a2a2a;
    --input-color-dark-background-tertiary: #1a1a1a;
    --input-color-dark-text: #e0e0e0;
    --input-color-dark-border: #333;
    --input-color-dark-border-light: #444;
    --input-color-dark-text-light: #999;
    --input-color-dark-text-muted: #666;
    --input-color-dark-text-very-muted: #555;

    /* Dark mode input overrides */
    --calendar-input-background: var(--input-color-dark-background-secondary);
    --calendar-input-border: 1px solid var(--input-color-dark-border-light);
    --calendar-input-color: var(--input-color-dark-text);
    --calendar-input-disabled-background: var(--input-color-dark-background-tertiary);
    --calendar-input-disabled-color: var(--input-color-dark-text-muted);
    --calendar-input-placeholder-color: var(--input-color-dark-text-light);

    /* Dark mode popover overrides */
    --popover-background: var(--input-color-dark-background);
    --popover-border: 1px solid var(--input-color-dark-border);
    --popover-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    --popover-arrow-color: var(--input-color-dark-border);
    --popover-arrow-inner-color: var(--input-color-dark-background);
  }
}
```

### Accessibility Features

The component includes built-in support for:

- **Reduced Motion**: Transitions are disabled when `prefers-reduced-motion: reduce` is set
- **High Contrast Mode**: Border width increases when `prefers-contrast: more` is set
- **Responsive Design**: Automatically adjusts for mobile devices (max-width: 768px and 480px)

### Customization Examples

#### Change Primary Color

```css
:root {
  --input-color-primary: #ff6b6b;
  --input-color-primary-light: #ffe0e0;
}
```

#### Increase Border Radius

```css
:root {
  --input-border-radius-md: 16px;
  --calendar-input-border-radius: 16px;
  --popover-border-radius: 16px;
}
```

#### Adjust Spacing

```css
:root {
  --input-spacing-lg: 24px;
  --input-padding-container: 24px;
}
```

---

## Best Practices

- Always use `Date` objects, not strings
- Be aware of timezone differences
- Normalize dates when comparing (use `CalendarService.normalizeDate()`)

```typescript
// Good
const date = new Date(2024, 0, 15);
const dates = [date1, date2, date3];

// Avoid
const dateString = '2024-01-15';
```

### 2. Selection Modes
- Use `'single'` for simple date pickers
- Use `'multiple'` for selecting multiple individual dates
- Use `'range'` for date range selection (e.g., check-in/check-out)

### 3. Disabled Dates
- Pre-calculate disabled dates for performance
- Use signals to make disabled dates reactive

```typescript
disabledDates = computed(() => {
  const dates: Date[] = [];
  const today = new Date();
  // Add next 5 days as disabled
  for (let i = 1; i <= 5; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
});
```

### 4. Form Integration
- Use `formControlName` with Calendar Input in Reactive Forms
- Use `inject()` function for dependency injection
- Validate dates in form validators

```typescript
import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export class MyComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    startDate: [undefined, Validators.required],
    endDate: [undefined, Validators.required]
  }, { validators: this.dateRangeValidator });

  private dateRangeValidator = (group: FormGroup) => {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && start > end ? { invalidRange: true } : null;
  };
}
```

### 5. Accessibility
- Always include proper labels with `<label>` elements
- Test with keyboard navigation (Tab, Enter, Escape)
- Use screen readers to verify ARIA labels
- Ensure sufficient color contrast (WCAG AA)

```html
<label for="date-input">Select Date:</label>
<ngx-date-picker
  id="date-input"
  selectionMode="single"
  placeholder="Pick a date"
  (dateSelected)="onDateSelected($event)"
/>
```

### 6. Performance & Best Practices
- Always use `ChangeDetectionStrategy.OnPush` in components
- Use signals for local component state
- Use `computed()` for derived state
- Use `inject()` instead of constructor injection
- Use native control flow (`@if`, `@for`) instead of `*ngIf`, `*ngFor`
- Normalize dates to midnight to avoid timezone issues

```typescript
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  private fb = inject(FormBuilder);
  selectedDate = signal<Date | undefined>(undefined);
  
  displayDate = computed(() => {
    const date = this.selectedDate();
    return date ? date.toLocaleDateString() : 'No date selected';
  });
}
```
## Examples

### Example 1: Simple Date Picker

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-date-picker',
  template: `
    <ngx-date-picker
      selectionMode="single"
      placeholder="Pick a date"
      (dateSelected)="onDateSelected($event)"
    />
    @if (selectedDate()) {
      <p>You selected: {{ selectedDate() | date: 'fullDate' }}</p>
    }
  `,
  imports: [NgxDatePickerComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent {
  selectedDate = signal<Date | undefined>(undefined);

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
  }
}
```

### Example 2: Date Range Picker

```typescript
import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-range-picker',
  template: `
    <ngx-date-picker
      selectionMode="range"
      placeholder="Select date range"
      (dateRangeSelected)="onRangeSelected($event)"
    />
    @if (dateRange()) {
      <div>
        <p>From: {{ dateRange()!.start | date: 'shortDate' }}</p>
        <p>To: {{ dateRange()!.end | date: 'shortDate' }}</p>
        <p>Days: {{ getDayCount() }}</p>
      </div>
    }
  `,
  imports: [NgxDatePickerComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangePickerComponent {
  dateRange = signal<{ start: Date; end: Date } | undefined>(undefined);

  dayCount = computed(() => {
    const range = this.dateRange();
    if (!range) return 0;
    const time = range.end.getTime() - range.start.getTime();
    return Math.ceil(time / (1000 * 60 * 60 * 24)) + 1;
  });

  onRangeSelected(range: { start: Date; end: Date }): void {
    this.dateRange.set(range);
  }

  getDayCount(): number {
    return this.dayCount();
  }
}
```

### Example 3: Disabled Dates

```typescript
import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { NgxCalendarComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-disabled-dates',
  template: `
    <ngx-calendar
      selectionMode="single"
      [disabledDates]="disabledDates()"
      (dateSelected)="onDateSelected($event)"
    />
  `,
  imports: [NgxCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisabledDatesComponent {
  disabledDates = computed(() => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable weekends for next 365 days
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dates.push(date);
      }
    }
    return dates;
  });

  onDateSelected(date: Date): void {
    console.log('Selected:', date);
  }
}
```

### Example 4: Custom Weekday Names (Internationalization)

```typescript
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCalendarComponent } from 'ngx-datepicker-calendar';

type Language = 'en' | 'es' | 'fr';

@Component({
  selector: 'app-custom-weekdays',
  template: `
    <div>
      <button (click)="setLanguage('en')">English</button>
      <button (click)="setLanguage('es')">Spanish</button>
      <button (click)="setLanguage('fr')">French</button>
    </div>
    <ngx-calendar
      selectionMode="single"
      [customWeekdayNames]="weekdayNames()"
      (dateSelected)="onDateSelected($event)"
    />
  `,
  imports: [NgxCalendarComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomWeekdaysComponent {
  private language = signal<Language>('en');

  weekdayNames = computed(() => {
    const lang = this.language();
    const names: Record<Language, string[]> = {
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    };
    return names[lang];
  });

  setLanguage(lang: Language): void {
    this.language.set(lang);
  }

  onDateSelected(date: Date): void {
    console.log('Selected:', date);
  }
}
```

### Example 5: Min/Max Date Constraints

```typescript
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { NgxCalendarComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-constrained-dates',
  template: `
    <ngx-calendar
      selectionMode="single"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      (dateSelected)="onDateSelected($event)"
    />
  `,
  imports: [NgxCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstrainedDatesComponent {
  minDate = signal(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }());

  maxDate = computed(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  onDateSelected(date: Date): void {
    console.log('Selected:', date);
  }
}

### Example 6: Custom Date Formatting

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-date-format',
  template: `
    <div>
      <h3>Predefined Formats</h3>
      <div>
        <label>Short Format (12/25/24):</label>
        <ngx-date-picker
          dateFormat="short"
          placeholder="Pick a date"
          (dateSelected)="onDateSelected($event)"
        />
        @if (selectedDate()) {
          <p>Selected: {{ selectedDate() | date: 'short' }}</p>
        }
      </div>

      <div>
        <label>Medium Format (Dec 25, 2024):</label>
        <ngx-date-picker
          dateFormat="medium"
          placeholder="Pick a date"
          (dateSelected)="onDateSelected($event)"
        />
        @if (selectedDate()) {
          <p>Selected: {{ selectedDate() | date: 'medium' }}</p>
        }
      </div>

      <div>
        <label>Long Format (December 25, 2024):</label>
        <ngx-date-picker
          dateFormat="long"
          placeholder="Pick a date"
          (dateSelected)="onDateSelected($event)"
        />
        @if (selectedDate()) {
          <p>Selected: {{ selectedDate() | date: 'long' }}</p>
        }
      </div>

      <div>
        <label>Full Format (Monday, December 25, 2024):</label>
        <ngx-date-picker
          dateFormat="full"
          placeholder="Pick a date"
          (dateSelected)="onDateSelected($event)"
        />
        @if (selectedDate()) {
          <p>Selected: {{ selectedDate() | date: 'full' }}</p>
        }
      </div>

      <h3>Custom Format</h3>
      <div>
        <label>Custom Format (MM/DD/YYYY):</label>
        <ngx-date-picker
          [customDateFormatOptions]="customFormat()"
          placeholder="Pick a date"
          (dateSelected)="onDateSelected($event)"
        />
        @if (selectedDate()) {
          <p>Selected: {{ selectedDate() | date: 'MM/dd/yyyy' }}</p>
        }
      </div>
    </div>
  `,
  imports: [NgxDatePickerComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFormatComponent {
  selectedDate = signal<Date | undefined>(undefined);

  customFormat = signal({
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
  }
}

---

## Accessibility

### Keyboard Navigation

- **Tab** - Navigate between interactive elements
- **Enter/Space** - Select date or activate button
- **Escape** - Close popover (Calendar Input)

### Screen Reader Support

- All interactive elements have proper `aria-label` attributes
- Selected dates are marked with `aria-pressed="true"`
- Disabled dates are marked with `aria-disabled="true"`
- Semantic HTML structure for proper navigation

### Visual Accessibility

- High contrast mode support
- Dark mode support
- Sufficient color contrast (WCAG AA)
- Clear focus indicators
- Reduced motion support

### Testing Accessibility

```typescript
// Test with keyboard
// 1. Tab to calendar
// 2. Use arrow keys to navigate (if implemented)
// 3. Press Enter to select
// 4. Press Escape to close

// Test with screen reader
// 1. Use NVDA, JAWS, or VoiceOver
// 2. Verify all dates are announced
// 3. Verify selection state is announced
```

---

## FAQ

### Q: How do I disable weekends?

**A:** Use the `disableWeekends` input:

```html
<!-- Disable both Saturday and Sunday -->
<ngx-calendar [disableWeekends]="true" />

<!-- Disable only Sunday -->
<ngx-calendar [disableWeekends]="1" />

<!-- Disable Saturday and Sunday -->
<ngx-calendar [disableWeekends]="2" />

<!-- Disable custom days (e.g., Sunday and Wednesday) -->
<ngx-calendar [disableWeekends]="[0, 3]" />
```

### Q: How do I set a default selected date?

**A:** Use the `preSelectedDate`, `preSelectedDates`, or `preSelectedRange` inputs:

```html
<ngx-calendar [preSelectedDate]="today" />
<ngx-calendar [preSelectedDates]="[date1, date2]" />
<ngx-calendar [preSelectedRange]="{ start: date1, end: date2 }" />
```

### Q: How do I customize the styling?

**A:** Override CSS variables in your global styles:

```css
:root {
  --input-color-primary: #your-color;
  --calendar-input-border-radius: 12px;
  /* ... more variables */
}
```

### Q: How do I handle timezone issues?

**A:** Always normalize dates to midnight UTC:

```typescript
const date = new Date();
date.setHours(0, 0, 0, 0);
```

### Q: Can I use this with Reactive Forms?

**A:** Yes! Both `NgxCalendarComponent` and `NgxDatePickerComponent` fully support Reactive Forms via `ControlValueAccessor`. You can use them with `formControl`, `formControlName`, and all form validation features.

**With NgxDatePickerComponent (Recommended):**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-date-form',
  template: `
    <form [formGroup]="form">
      <label for="date">Select Date:</label>
      <ngx-date-picker
        id="date"
        formControlName="selectedDate"
        selectionMode="single"
        placeholder="Pick a date"
      />
      @if (form.get('selectedDate')?.hasError('required') && form.get('selectedDate')?.touched) {
        <p class="error">Date is required</p>
      }
      <button [disabled]="form.invalid">Submit</button>
    </form>
  `,
  imports: [ReactiveFormsModule, NgxDatePickerComponent],
})
export class DateFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    selectedDate: [undefined, Validators.required],
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Selected date:', this.form.value.selectedDate);
    }
  }
}
```

**With NgxCalendarComponent (Direct):**

```html
<form [formGroup]="form">
  <ngx-calendar
    formControlName="dateField"
    selectionMode="single"
  />
</form>
```

**Features:**

- Full form validation support
- Automatic touched/dirty state tracking
- Works with `formControl`, `formControlName`, `formGroup`
- Supports all form validators
- Automatic value synchronization
- Works with all selection modes (single, multiple, range)

### Q: How do I customize the date format displayed in the input?

**A:** Use the `dateFormat` input with predefined formats or `customDateFormatOptions` for full control:

```html
<!-- Predefined formats -->
<ngx-date-picker dateFormat="short" />
<ngx-date-picker dateFormat="medium" />
<ngx-date-picker dateFormat="long" />
<ngx-date-picker dateFormat="full" />

<!-- Custom format - MM/DD/YYYY -->
<ngx-date-picker
  [customDateFormatOptions]="{ 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }"
/>

<!-- Custom format - Full with weekday -->
<ngx-date-picker
  [customDateFormatOptions]="{ 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }"
/>

<!-- Custom format - Abbreviated -->
<ngx-date-picker
  [customDateFormatOptions]="{ 
    year: '2-digit', 
    month: 'short', 
    day: '2-digit' 
  }"
/>
```

**Format Examples:**
- `short`: `12/25/24`
- `medium`: `Dec 25, 2024` (default)
- `long`: `December 25, 2024`
- `full`: `Monday, December 25, 2024`
- Custom `MM/DD/YYYY`: `12/25/2024`
- Custom with weekday: `Monday, December 25, 2024`

### Q: How do I get the selected date in a specific format?

**A:** Use the `dateFormat` input on NgxDatePickerComponent or use Angular's date pipe:

```html
<!-- Using NgxDatePickerComponent with format -->
<ngx-date-picker
  dateFormat="long"
  (dateSelected)="onDateSelected($event)"
/>

<!-- Using Angular date pipe -->
{{ selectedDate | date: 'yyyy-MM-dd' }}
```

```typescript
import { CalendarService } from './calendar.service';
import { inject } from '@angular/core';

export class MyComponent {
  private calendarService = inject(CalendarService);

  formatDate(date: Date): string {
    return this.calendarService.formatDate(date, 'MM/DD/YYYY');
  }
}
```

### Q: How do I support multiple languages?

**A:** Use custom weekday names:

```typescript
weekdayNames = computed(() => {
  const lang = this.language();
  const names = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  };
  return names[lang];
});
```

### Q: Is the component mobile-friendly?

**A:** Yes! The component is fully responsive and works on mobile devices with touch support.

### Q: Can I customize the month/year buttons?

**A:** Yes! Use the button text and icon inputs:

```html
<ngx-calendar
  [preMonthTextBtn]="'← Previous'"
  [nextMonthBtnText]="'Next →'"
/>
```

---

## Support & Contribution

For issues, feature requests, or contributions, please refer to the project repository.

## License

MIT