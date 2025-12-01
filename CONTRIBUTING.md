# Contributing to ngx-datepicker-calendar

Thank you for your interest in contributing to **ngx-datepicker-calendar**! We welcome contributions from the community. This guide will help you get started with setting up the project locally and understanding our contribution standards.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Local Development Setup](#local-development-setup)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
4. [Date Picker Calendar Demo Component](#date-picker-demo-component)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Documentation](#documentation)
9. [Code of Conduct](#code-of-conduct)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Angular CLI**: v18.0.0 or higher
- **Git**: Latest version
- **TypeScript**: v5.2.0 or higher

### Verify Installation

```bash
node --version      # Should be v18.0.0+
npm --version       # Should be v9.0.0+
ng version          # Should be v18.0.0+
git --version       # Should be latest
```

---

## Local Development Setup

### Step 1: Create an Angular Workspace

First, create a new Angular workspace to work with ngx-datepicker-calendar:

```bash
ng new ngx-workspace
cd ngx-workspace
```

When prompted, choose:
- **Routing**: Yes (optional, based on preference)
- **Stylesheet format**: SCSS (recommended)

### Step 2: Create Projects Folder

In the root directory of your workspace, create a `projects` folder:

```bash
mkdir projects
cd projects
```

### Step 3: Clone the Repository

Clone the ngx-datepicker-calendar repository into the projects folder:

```bash
git clone https://github.com/mumair4462/ngx-datepicker-calendar.git
cd ngx-datepicker-calendar
```

Your directory structure should now look like:

```
ngx-workspace/
├── projects/
│   └── ngx-datepicker-calendar/
│       ├── src/
│       ├── README.md
│       ├── package.json
│       ├── tsconfig.json
│       └── ...
├── src/
├── angular.json
├── package.json
└── ...
```

### Step 4: Install Dependencies

Install the dependencies for both the workspace and the library:

```bash
# From ngx-workspace root
npm install

```

### Step 4a: Update angular.json

Add the library configuration to your workspace's `angular.json` file under the `ngx-workspace`:

```json
{
  "projects": {
    ....
    "ngx-datepicker-calendar": {
      "projectType": "library",
      "root": "projects/ngx-datepicker-calendar",
      "sourceRoot": "projects/ngx-datepicker-calendar/src",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "projects/ngx-datepicker-calendar/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "projects/ngx-datepicker-calendar/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "projects/ngx-datepicker-calendar/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "tsConfig": "projects/ngx-datepicker-calendar/tsconfig.spec.json",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ]
          }
        }
      }
    }
  }
}
```

This configuration enables:
- **Build**: Compile the library using ng-packagr
- **Test**: Run unit tests with Karma
- **Development & Production**: Separate TypeScript configurations for different build modes

### Step 5: Link the Library

Link the library to your workspace for local development:

```bash
# From ngx-workspace root
npm link ./projects/ngx-datepicker-calendar
```

### Step 6: Verify Setup

Create a test component in your workspace to verify the setup:

```bash
ng generate component test-date-picker
```

Update `src/app/test-date-picker/test-date-picker.component.ts`:

```typescript
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgxDatePickerComponent } from 'ngx-datepicker-calendar';

@Component({
  selector: 'app-test-date-picker',
  imports: [NgxDatePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>ngx-datepicker-calendar Test</h2>
    <ngx-date-picker
      selectionMode="single"
      placeholder="Select a date"
      (dateSelected)="onDateSelected($event)"
    />
    @if (selectedDate()) {
      <p>Selected: {{ selectedDate() | date: 'fullDate' }}</p>
    }
  `
})
export class TestDatePickerComponent {
  selectedDate = signal<Date | null>(null);

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
    console.log('Date selected:', date);
  }
}
```

Add the component to your `app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { TestDatePickerComponent } from './test-date-picker/test-date-picker.component';

@Component({
  selector: 'app-root',
  imports: [TestDatePickerComponent],
  template: `
    <app-test-date-picker></app-test-date-picker>
  `
})
export class AppComponent {}
```

Run the development server:

```bash
ng serve
```

Visit `http://localhost:4200` to verify the setup is working.

---

## Project Structure

```
ngx-datepicker-calendar/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ngx-date-picker.component.ts
│   │   │   ├── ngx-date-picker.component.html
│   │   │   ├── ngx-date-picker.component.css
│   │   │   ├── ngx-calendar.component.ts
│   │   │   ├── ngx-calendar.component.html
│   │   │   ├── ngx-calendar.component.css
│   │   │   └── ngx-date-picker-input/
│   │   ├── services/
│   │   │   └── ngx-datepicker-calendar.service.ts
│   │   ├── types/
│   │   │   └── date-picker-calendar.types.ts
│   │   ├── constants/
│   │   │   └── date-picker.const.ts
│   │   ├── theme/
│   │   │   ├── date-picker-light.css
│   │   │   ├── date-picker-dark.css
│   │   │   ├── date-picker-input-light.css
│   │   │   ├── date-picker-input-dark.css
│   │   │   └── README.md
│   │   └── ngx-datepicker-calendar.module.ts
│   └── public-api.ts
├── README.md
├── CONTRIBUTING.md
├── package.json
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.lib.prod.json
├── tsconfig.spec.json
├── ng-package.json
└── ...
```

### Key Files

- **`src/lib/components/ngx-date-picker.component.ts`** - Date picker input wrapper component
- **`src/lib/components/ngx-calendar.component.ts`** - Main calendar component
- **`src/lib/services/ngx-datepicker-calendar.service.ts`** - Shared service for date operations
- **`src/lib/types/date-picker-calendar.types.ts`** - TypeScript type definitions
- **`src/lib/constants/date-picker.const.ts`** - Application constants
- **`src/lib/theme/`** - CSS theme files (light and dark modes)
- **`src/public-api.ts`** - Public API exports
- **`ng-package.json`** - ng-packagr configuration for library packaging
- **`tsconfig.lib.json`** - TypeScript configuration for development builds
- **`tsconfig.lib.prod.json`** - TypeScript configuration for production builds
- **`tsconfig.spec.json`** - TypeScript configuration for unit tests

---

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

Edit the relevant files in the `src/lib/` directory. Follow the coding standards (see below).

### 3. Build the Library

Build the library to ensure there are no compilation errors:

```bash
# From ngx-workspace root
ng build ngx-datepicker-calendar
```

Or for production build:

```bash
ng build ngx-datepicker-calendar --configuration production
```

### 4. Test Your Changes

Run tests to ensure your changes don't break existing functionality:

```bash
# From ngx-workspace root
ng test ngx-datepicker-calendar
```

### 5. Commit Your Changes

Follow the commit guidelines (see below) when committing:

```bash
git add .
git commit -m "feat: add new feature description"
```

### 6. Push and Create a Pull Request

Push your branch and create a pull request:

```bash
git push origin feature/your-feature-name
```

---

## Date Picker Demo Component

```typescript
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgxDatePickerComponent, NgxCalendarComponent } from '../../projects/ngx-datepicker-calendar/dist/ngx-date-picker-calendar';
import { NgxDatePickerComponent, NgxCalendarComponent } from '../../projects/ngx-datepicker-calendar/src/public-api';

@Component({
  selector: 'ngx-date-picker-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxDatePickerComponent, NgxCalendarComponent],
  template: `
    <div class="demo-container">
      <h1>Calendar Component Demo</h1>

      <div class="demo-grid">
        <!-- Calendar Input - Single Selection -->
        <div class="demo-section">
          <h2>Calendar Input - Single Date</h2>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            (dateSelected)="selectedInputSingleDate.set($event)"
          />
          @if (selectedInputSingleDate()) {
            <p class="result">Selected: {{ formatDate(selectedInputSingleDate()!) }}</p>
          }
        </div>

        <!-- Calendar Input - Multiple Selection -->
        <div class="demo-section">
          <h2>Calendar Input - Multiple Dates</h2>
          <ngx-date-picker
            selectionMode="multiple"
            placeholder="Select multiple dates"
            [highlightToday]="true"
            (datesSelected)="selectedInputMultipleDates.set($event)"
          />
          @if (selectedInputMultipleDates().length > 0) {
            <p class="result">Selected {{ selectedInputMultipleDates().length }} dates:</p>
            <ul class="date-list">
              @for (date of selectedInputMultipleDates(); track date.getTime()) {
                <li>{{ formatDate(date) }}</li>
              }
            </ul>
          }
        </div>

        <!-- Calendar Input - Range Selection -->
        <div class="demo-section">
          <h2>Calendar Input - Date Range</h2>
          <ngx-date-picker
            selectionMode="range"
            placeholder="Select date range"
            [highlightToday]="true"
            (dateRangeSelected)="selectedInputRange.set($event)"
          />
          @if (selectedInputRange()) {
            <p class="result">
              Range: {{ formatDate(selectedInputRange()!.start) }} to
              {{ formatDate(selectedInputRange()!.end) }}
            </p>
          }
        </div>

        <!-- Calendar Input - With Disabled Dates -->
        <div class="demo-section">
          <h2>Calendar Input - Disabled Dates</h2>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            [disabledDates]="disabledDates()"
            [highlightToday]="true"
            (dateSelected)="selectedInputDisabledDate.set($event)"
          />
          @if (selectedInputDisabledDate()) {
            <p class="result">Selected: {{ formatDate(selectedInputDisabledDate()!) }}</p>
          }
        </div>

        <!-- Single Selection -->
        <div class="demo-section">
          <h2>Single Date Selection</h2>
          <ngx-calendar
            selectionMode="single"
            (dateSelected)="onSingleDateSelected($event)"
            
          />
          @if (selectedSingleDate()) {
            <p class="result">Selected: {{ formatDate(selectedSingleDate()!) }}</p>
          }
        </div>

        <!-- Multiple Selection -->
        <div class="demo-section">
          <h2>Multiple Dates Selection</h2>
          <ngx-calendar
            selectionMode="multiple"
            (datesSelected)="onMultipleDatesSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedMultipleDates().length > 0) {
            <p class="result">Selected {{ selectedMultipleDates().length }} dates:</p>
            <ul class="date-list">
              @for (date of selectedMultipleDates(); track date.getTime()) {
                <li>{{ formatDate(date) }}</li>
              }
            </ul>
          }
        </div>

        <!-- Range Selection -->
        <div class="demo-section">
          <h2>Date Range Selection</h2>
          <ngx-calendar
            selectionMode="range"
            (dateRangeSelected)="onDateRangeSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedRange()) {
            <p class="result">
              Range: {{ formatDate(selectedRange()!.start) }} to
              {{ formatDate(selectedRange()!.end) }}
            </p>
          }
        </div>

        <!-- With Disabled Dates -->
        <div class="demo-section">
          <h2>With Disabled Dates</h2>
          <ngx-calendar
            selectionMode="single"
            [disabledDates]="disabledDates()"
            (dateSelected)="onDisabledDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedDisabledDate()) {
            <p class="result">Selected: {{ formatDate(selectedDisabledDate()!) }}</p>
          }
        </div>

        <!-- With Min/Max Dates -->
        <div class="demo-section">
          <h2>With Min/Max Date Range</h2>
          <ngx-calendar
            selectionMode="single"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
            (dateSelected)="onMinMaxDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedMinMaxDate()) {
            <p class="result">Selected: {{ formatDate(selectedMinMaxDate()!) }}</p>
          }
        </div>

        <!-- No Past Dates -->
        <div class="demo-section">
          <h2>No Past Dates Allowed</h2>
          <ngx-calendar
            selectionMode="single"
            [allowPastDates]="false"
            (dateSelected)="onNoPastDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedNoPastDate()) {
            <p class="result">Selected: {{ formatDate(selectedNoPastDate()!) }}</p>
          }
        </div>

        <!-- Disable Weekends (Boolean) -->
        <div class="demo-section">
          <h2>Disable Both Weekends (true)</h2>
          <p class="hint">Disables Saturday & Sunday</p>
          <ngx-calendar
            selectionMode="single"
            [disableWeekends]="true"
            (dateSelected)="onWeekendDisabledDateSelected($event)"
            [highlightToday]="true"
            [showOtherMonthDays]="false"
          />
          @if (selectedWeekendDisabledDate()) {
            <p class="result">Selected: {{ formatDate(selectedWeekendDisabledDate()!) }}</p>
          }
        </div>

        <!-- Disable Only Sunday -->
        <div class="demo-section">
          <h2>Disable Only Sunday (1)</h2>
          <p class="hint">Disables only Sunday</p>
          <ngx-calendar
            selectionMode="single"
            [disableWeekends]="1"
            (dateSelected)="onDisableSundayDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedDisableSundayDate()) {
            <p class="result">Selected: {{ formatDate(selectedDisableSundayDate()!) }}</p>
          }
        </div>

        <!-- Disable Saturday & Sunday -->
        <div class="demo-section">
          <h2>Disable Sat & Sun (2)</h2>
          <p class="hint">Disables Saturday & Sunday</p>
          <ngx-calendar
            selectionMode="single"
            [disableWeekends]="2"
            (dateSelected)="onDisableSatSunDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedDisableSatSunDate()) {
            <p class="result">Selected: {{ formatDate(selectedDisableSatSunDate()!) }}</p>
          }
        </div>

        <!-- Disable Custom Days Array [0, 3] -->
        <div class="demo-section">
          <h2>Disable Custom Days [0, 3]</h2>
          <p class="hint">Disables Sunday (0) & Wednesday (3)</p>
          <ngx-calendar
            selectionMode="single"
            [disableWeekends]="[0, 3]"
            (dateSelected)="onDisableCustomDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedDisableCustomDate()) {
            <p class="result">Selected: {{ formatDate(selectedDisableCustomDate()!) }}</p>
          }
        </div>

        <!-- Hide Other Month Days -->
        <div class="demo-section">
          <h2>Hide Other Month Days</h2>
          <ngx-calendar
            selectionMode="single"
            [showOtherMonthDays]="false"
            (dateSelected)="onHideOtherMonthDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedHideOtherMonthDate()) {
            <p class="result">Selected: {{ formatDate(selectedHideOtherMonthDate()!) }}</p>
          }
        </div>

        <!-- Custom Weekday Names (Short) -->
        <div class="demo-section">
          <h2>Custom Weekday Names (Short)</h2>
          <p class="hint">Using: S, M, T, W, T, F, S</p>
          <ngx-calendar
            selectionMode="single"
            [customWeekdayNames]="['S', 'M', 'T', 'W', 'T', 'F', 'S']"
            (dateSelected)="onCustomWeekdayDateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedCustomWeekdayDate()) {
            <p class="result">Selected: {{ formatDate(selectedCustomWeekdayDate()!) }}</p>
          }
        </div>

        <!-- Custom Weekday Names (Single Letter) -->
        <div class="demo-section">
          <h2>Custom Weekday Names (Single Letter)</h2>
          <p class="hint">Using: Su, Mo, Tu, We, Th, Fr, Sa</p>
          <ngx-calendar
            selectionMode="single"
            [customWeekdayNames]="['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
            (dateSelected)="onCustomWeekday2DateSelected($event)"
            [highlightToday]="true"
          />
          @if (selectedCustomWeekday2Date()) {
            <p class="result">Selected: {{ formatDate(selectedCustomWeekday2Date()!) }}</p>
          }
        </div>

        <!-- Custom Weekday Names with Calendar Input -->
        <div class="demo-section">
          <h2>Calendar Input - Custom Weekdays</h2>
          <p class="hint">Using: D, L, M, M, J, V, S</p>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            [customWeekdayNames]="['D', 'L', 'M', 'M', 'J', 'V', 'S']"
            [highlightToday]="true"
            (dateSelected)="selectedInputCustomWeekdayDate.set($event)"
          />
          @if (selectedInputCustomWeekdayDate()) {
            <p class="result">Selected: {{ formatDate(selectedInputCustomWeekdayDate()!) }}</p>
          }
        </div>

        <!-- Date Format - Short -->
        <div class="demo-section">
          <h2>Date Format - Short</h2>
          <p class="hint">Format: 12/25/24</p>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            dateFormat="short"
            [highlightToday]="true"
            (dateSelected)="selectedFormatShortDate.set($event)"
          />
          @if (selectedFormatShortDate()) {
            <p class="result">Selected: {{ selectedFormatShortDate() | date: 'short' }}</p>
          }
        </div>

        <!-- Date Format - Medium (Default) -->
        <div class="demo-section">
          <h2>Date Format - Medium (Default)</h2>
          <p class="hint">Format: Dec 25, 2024</p>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            dateFormat="medium"
            [highlightToday]="true"
            (dateSelected)="selectedFormatMediumDate.set($event)"
          />
          @if (selectedFormatMediumDate()) {
            <p class="result">Selected: {{ selectedFormatMediumDate() | date: 'medium' }}</p>
          }
        </div>

        <!-- Date Format - Long -->
        <div class="demo-section">
          <h2>Date Format - Long</h2>
          <p class="hint">Format: December 25, 2024</p>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            dateFormat="long"
            [highlightToday]="true"
            (dateSelected)="selectedFormatLongDate.set($event)"
          />
          @if (selectedFormatLongDate()) {
            <p class="result">Selected: {{ selectedFormatLongDate() | date: 'long' }}</p>
          }
        </div>

        <!-- Date Format - Full -->
        <div class="demo-section">
          <h2>Date Format - Full</h2>
          <p class="hint">Format: Monday, December 25, 2024</p>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            dateFormat="full"
            [highlightToday]="true"
            (dateSelected)="selectedFormatFullDate.set($event)"
          />
          @if (selectedFormatFullDate()) {
            <p class="result">Selected: {{ selectedFormatFullDate() | date: 'full' }}</p>
          }
        </div>

        <!-- Date Format - Custom (MM/DD/YYYY) -->
        <div class="demo-section">
          <h2>Date Format - Custom (MM/DD/YYYY)</h2>
          <p class="hint">Custom format: numeric month, day, year</p>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            [customDateFormatOptions]="customFormatMMDDYYYY()"
            [highlightToday]="true"
            (dateSelected)="selectedFormatCustomDate.set($event)"
          />
          @if (selectedFormatCustomDate()) {
            <p class="result">Selected: {{ selectedFormatCustomDate() | date: 'MM/dd/yyyy' }}</p>
          }
        </div>

        <!-- Date Format - Custom (Full with Time) -->
        <div class="demo-section">
          <h2>Date Format - Custom (With Weekday)</h2>
          <p class="hint">Custom format: weekday, month, day, year</p>
          <ngx-date-picker
            selectionMode="single"
            placeholder="Pick a date"
            [customDateFormatOptions]="customFormatWithWeekday()"
            [highlightToday]="true"
            (dateSelected)="selectedFormatWeekdayDate.set($event)"
          />
          @if (selectedFormatWeekdayDate()) {
            <p class="result">Selected: {{ selectedFormatWeekdayDate() | date: 'EEEE, MMMM d, y' }}</p>
          }
        </div>

        <!-- Reactive Forms - Calendar Input Example -->
        <div class="demo-section">
          <h2>Reactive Forms - Calendar Input</h2>
          <p class="hint">Form validation with required validator</p>
          <form [formGroup]="dateForm">
            <ngx-date-picker
              formControlName="singleDate"
              selectionMode="single"
              placeholder="Pick a date (required)"
              [highlightToday]="true"
            />
            @if (dateForm.get('singleDate')?.hasError('required') && dateForm.get('singleDate')?.touched) {
              <p class="error">Date is required</p>
            }
            <p class="form-status">
              Status: 
              <span [class.valid]="dateForm.get('singleDate')?.valid" [class.invalid]="dateForm.get('singleDate')?.invalid">
                {{ dateForm.get('singleDate')?.valid ? '✓ Valid' : '✗ Invalid' }}
              </span>
            </p>
          </form>
        </div>

        <!-- Reactive Forms - Calendar Input Multiple -->
        <div class="demo-section">
          <h2>Reactive Forms - Multiple Dates</h2>
          <p class="hint">Form with multiple date selection</p>
          <form [formGroup]="dateForm">
            <ngx-date-picker
              formControlName="multipleDates"
              selectionMode="multiple"
              placeholder="Select multiple dates"
              [highlightToday]="true"
            />
            @if (multipleDatesCount() > 0) {
              <p class="result">Selected {{ multipleDatesCount() }} dates</p>
            }
          </form>
        </div>

        <!-- Reactive Forms - Calendar Input Range -->
        <div class="demo-section">
          <h2>Reactive Forms - Date Range</h2>
          <p class="hint">Form with date range selection</p>
          <form [formGroup]="dateForm">
            <ngx-date-picker
              formControlName="dateRange"
              selectionMode="range"
              placeholder="Select date range"
              [highlightToday]="true"
            />
            @if (dateRangeValue()) {
              <p class="result">
                Range: {{ dateRangeValue()!.start | date: 'short' }} 
                to 
                {{ dateRangeValue()!.end | date: 'short' }}
              </p>
            }
          </form>
        </div>

        <!-- Reactive Forms - Calendar Component -->
        <div class="demo-section">
          <h2>Reactive Forms - Calendar Component</h2>
          <p class="hint">Direct calendar with form control</p>
          <form [formGroup]="dateForm">
            <ngx-calendar
              formControlName="calendarDate"
              selectionMode="single"
              [highlightToday]="true"
            />
            <p class="form-status">
              Touched: <strong>{{ dateForm.get('calendarDate')?.touched ? 'Yes' : 'No' }}</strong>
            </p>
          </form>
        </div>

        <!-- Reactive Forms - Complete Form Example -->
        <div class="demo-section">
          <h2>Reactive Forms - Complete Example</h2>
          <p class="hint">Full form with validation and submission</p>
          <form [formGroup]="completeForm" (ngSubmit)="onFormSubmit()">
            <div class="form-group">
              <label for="event-date">Event Date (Required):</label>
              <ngx-date-picker
                id="event-date"
                formControlName="eventDate"
                selectionMode="single"
                placeholder="Pick event date"
                [highlightToday]="true"
              />
              @if (completeForm.get('eventDate')?.hasError('required') && completeForm.get('eventDate')?.touched) {
                <p class="error">Event date is required</p>
              }
            </div>

            <div class="form-group">
              <label for="available-dates">Available Dates:</label>
              <ngx-date-picker
                id="available-dates"
                formControlName="availableDates"
                selectionMode="multiple"
                placeholder="Select available dates"
                [highlightToday]="true"
              />
            </div>

            <div class="form-actions">
              <button type="submit" [disabled]="completeForm.invalid">Submit</button>
              <button type="button" (click)="onFormReset()">Reset</button>
            </div>

            @if (formSubmitted()) {
              <div class="form-result">
                <h4>Form Data:</h4>
                <pre>{{ completeForm.value | json }}</pre>
              </div>
            }
          </form>
        </div>
      </div>
    </div>
  `,
  styles: `
    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 40px;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 30px;
    }

    .demo-section {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .demo-section h2 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 16px;
      color: #333;
    }

    .hint {
      margin: 0 0 16px 0;
      font-size: 12px;
      color: #999;
      font-style: italic;
    }

    .result {
      margin-top: 16px;
      padding: 12px;
      background-color: #e3f2fd;
      border-left: 4px solid #4a90e2;
      color: #1565c0;
      font-weight: 500;
      border-radius: 4px;
    }

    .date-list {
      margin: 12px 0;
      padding-left: 20px;
      background-color: #e3f2fd;
      border-left: 4px solid #4a90e2;
      border-radius: 4px;
      padding: 12px 12px 12px 30px;
    }

    .date-list li {
      color: #1565c0;
      margin: 4px 0;
    }

    .custom-directive-input {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 16px;
      font-weight: 500;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
    }

    .custom-directive-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .custom-directive-input:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-status {
      margin-top: 12px;
      font-size: 14px;
      color: #666;
    }

    .form-status span {
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .form-status span.valid {
      color: #28a745;
      background-color: #d4edda;
    }

    .form-status span.invalid {
      color: #dc3545;
      background-color: #f8d7da;
    }

    .form-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .form-actions button {
      flex: 1;
      padding: 10px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f5f5f5;
      color: #333;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .form-actions button:hover:not(:disabled) {
      background-color: #e8e8e8;
      border-color: #999;
    }

    .form-actions button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .form-result {
      margin-top: 16px;
      padding: 12px;
      background-color: #f0f0f0;
      border-radius: 4px;
      border-left: 4px solid #4a90e2;
    }

    .form-result h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .form-result pre {
      margin: 0;
      overflow-x: auto;
      background-color: #fff;
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
    }

    .error {
      color: #dc3545;
      font-size: 13px;
      margin-top: 8px;
      padding: 8px;
      background-color: #f8d7da;
      border-radius: 4px;
      border-left: 3px solid #dc3545;
    }

    @media (max-width: 768px) {
      .demo-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePIckerDemoComponent {
  private fb = inject(FormBuilder);

  // Reactive Forms
  dateForm = this.fb.group({
    singleDate: [undefined],
    multipleDates: [[]],
    dateRange: [undefined],
    calendarDate: [undefined],
  });

  completeForm = this.fb.group({
    eventDate: [undefined, Validators.required],
    availableDates: [[]],
  });

  formSubmitted = signal(false);

  // Computed values for template
  multipleDatesCount = computed(() => {
    const dates = this.dateForm.get('multipleDates')?.value as Date[] | undefined;
    return Array.isArray(dates) ? dates.length : 0;
  });

  dateRangeValue = computed(() => {
    return this.dateForm.get('dateRange')?.value as { start: Date; end: Date } | undefined;
  });

  selectedSingleDate = signal<Date | undefined>(undefined);
  selectedMultipleDates = signal<Date[]>([]);
  selectedRange = signal<{ start: Date; end: Date } | undefined>(undefined);
  selectedDisabledDate = signal<Date | undefined>(undefined);
  selectedMinMaxDate = signal<Date | undefined>(undefined);
  selectedNoPastDate = signal<Date | undefined>(undefined);
  selectedWeekendDisabledDate = signal<Date | undefined>(undefined);
  selectedDisableSundayDate = signal<Date | undefined>(undefined);
  selectedDisableSatSunDate = signal<Date | undefined>(undefined);
  selectedDisableCustomDate = signal<Date | undefined>(undefined);
  selectedHideOtherMonthDate = signal<Date | undefined>(undefined);

  // Calendar Input selections
  selectedInputSingleDate = signal<Date | undefined>(undefined);
  selectedInputMultipleDates = signal<Date[]>([]);
  selectedInputRange = signal<{ start: Date; end: Date } | undefined>(undefined);
  selectedInputDisabledDate = signal<Date | undefined>(undefined);

  // Custom Weekday selections
  selectedCustomWeekdayDate = signal<Date | undefined>(undefined);
  selectedCustomWeekday2Date = signal<Date | undefined>(undefined);
  selectedInputCustomWeekdayDate = signal<Date | undefined>(undefined);

  // Date Format selections
  selectedFormatShortDate = signal<Date | undefined>(undefined);
  selectedFormatMediumDate = signal<Date | undefined>(undefined);
  selectedFormatLongDate = signal<Date | undefined>(undefined);
  selectedFormatFullDate = signal<Date | undefined>(undefined);
  selectedFormatCustomDate = signal<Date | undefined>(undefined);
  selectedFormatWeekdayDate = signal<Date | undefined>(undefined);

  // Disabled dates: next 5 days
  disabledDates = computed<Date[]>(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  });

  // Min date: today
  minDate = signal<Date>(new Date());

  // Max date: 30 days from now
  maxDate = computed<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  });

  onSingleDateSelected(date: Date): void {
    this.selectedSingleDate.set(date);
  }

  onMultipleDatesSelected(dates: Date[]): void {
    this.selectedMultipleDates.set(dates);
  }

  onDateRangeSelected(range: { start: Date; end: Date }): void {
    this.selectedRange.set(range);
  }

  onDisabledDateSelected(date: Date): void {
    this.selectedDisabledDate.set(date);
  }

  onMinMaxDateSelected(date: Date): void {
    this.selectedMinMaxDate.set(date);
  }

  onNoPastDateSelected(date: Date): void {
    this.selectedNoPastDate.set(date);
  }

  onWeekendDisabledDateSelected(date: Date): void {
    this.selectedWeekendDisabledDate.set(date);
  }

  onDisableSundayDateSelected(date: Date): void {
    this.selectedDisableSundayDate.set(date);
  }

  onDisableSatSunDateSelected(date: Date): void {
    this.selectedDisableSatSunDate.set(date);
  }

  onDisableCustomDateSelected(date: Date): void {
    this.selectedDisableCustomDate.set(date);
  }

  onHideOtherMonthDateSelected(date: Date): void {
    this.selectedHideOtherMonthDate.set(date);
  }

  onCustomWeekdayDateSelected(date: Date): void {
    this.selectedCustomWeekdayDate.set(date);
  }

  onCustomWeekday2DateSelected(date: Date): void {
    this.selectedCustomWeekday2Date.set(date);
  }

  customFormatMMDDYYYY = signal({
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  } as Intl.DateTimeFormatOptions);

  customFormatWithWeekday = signal({
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } as Intl.DateTimeFormatOptions);

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  onFormSubmit(): void {
    if (this.completeForm.valid) {
      this.formSubmitted.set(true);
      console.log('Form submitted with data:', this.completeForm.value);
    }
  }

  onFormReset(): void {
    this.completeForm.reset();
    this.formSubmitted.set(false);
  }
}
```

---

## Coding Standards

### TypeScript

- Use **strict mode** in `tsconfig.json`
- Use **PascalCase** for class names
- Use **camelCase** for variables and methods
- Use **UPPER_SNAKE_CASE** for constants
- Always specify return types for functions
- Use `readonly` for immutable properties

Example:

```typescript
export class NgxDatePickerComponent {
  readonly DEFAULT_LOCALE = 'en-US';
  
  private selectedDate: Date | null = null;
  
  getFormattedDate(): string {
    return this.selectedDate?.toLocaleDateString() ?? '';
  }
}
```

### Angular Best Practices

- Use **OnPush** change detection strategy
- Use **signals** for state management (Angular 18+)
- Use **computed()** for derived state
- Use **inject()** for dependency injection
- Use **standalone components** when possible
- Avoid `*ngIf` and `*ngFor`, use `@if` and `@for` instead

Example:

```typescript
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{ formattedDate() }}</div>`
})
export class DatePickerComponent {
  private selectedDate = signal<Date | null>(null);
  
  formattedDate = computed(() => {
    const date = this.selectedDate();
    return date?.toLocaleDateString() ?? 'No date selected';
  });
}
```

### CSS/SCSS

- Use **CSS custom properties** (variables) for theming
- Use **BEM naming convention** for classes: `.block__element--modifier`
- Keep styles scoped to components
- Use **rem** units for sizing (relative to root font-size)
- Ensure **WCAG AA** color contrast

Example:

```scss
.date-picker {
  &__input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--input-color-border);
    border-radius: var(--input-border-radius-md);
    
    &--focused {
      border-color: var(--input-color-primary);
      box-shadow: 0 0 0 3px var(--input-color-primary-light);
    }
  }
}
```

### Comments and Documentation

- Write clear, concise comments
- Use JSDoc for public methods and properties
- Explain the "why", not the "what"

Example:

```typescript
/**
 * Formats a date to the specified format.
 * @param date - The date to format
 * @param format - The format string (e.g., 'MM/DD/YYYY')
 * @returns The formatted date string
 */
public formatDate(date: Date, format: string): string {
  // Implementation
}
```

---

## Commit Guidelines

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples

```bash
git commit -m "feat(calendar): add support for custom weekday names"
git commit -m "fix(input): resolve date parsing issue with timezones"
git commit -m "docs: update README with new examples"
git commit -m "refactor(service): simplify date normalization logic"
```

---

## Pull Request Process

### Before Submitting

1. **Ensure your code is clean**:
   ```bash
   npm run lint
   npm run format
   ```

2. **Run all tests**:
   ```bash
   npm run test
   ```

3. **Build the library**:
   ```bash
   npm run build
   ```

4. **Update documentation** if needed

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Testing
Describe how you tested your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

- At least one maintainer review is required
- All CI checks must pass
- No merge conflicts
- Code coverage should not decrease

---

## Documentation

### Update Documentation When

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Updating dependencies

### Documentation Files

- **README.md** - Main documentation
- **CONTRIBUTING.md** - Contribution guidelines (this file)
- **Inline comments** - Code documentation
- **JSDoc comments** - Public API documentation

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- **Be respectful** - Treat all community members with respect
- **Be inclusive** - Welcome people of all backgrounds and experiences
- **Be constructive** - Provide helpful feedback and suggestions
- **Be professional** - Keep discussions focused and productive

### Unacceptable Behavior

- Harassment, discrimination, or offensive language
- Trolling, insulting comments, or personal attacks
- Unwelcome sexual attention or advances
- Publishing private information without consent
- Other conduct that could reasonably be considered inappropriate

### Reporting Issues

If you witness or experience unacceptable behavior, please report it to the maintainers at [contact email]. All reports will be handled confidentially.

---

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Questions?

If you have any questions or need help, please:

1. Check the [README.md](./README.md) for documentation
2. Search existing [GitHub Issues](https://github.com/mumair4462/ngx-datepicker-calendar/issues)
3. Create a new issue with the `question` label
4. Join our community discussions

---

## License

By contributing to ngx-datepicker-calendar, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ngx-datepicker-calendar!
