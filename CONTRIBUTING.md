# Contributing to ngx-datepicker-calendar

Thank you for your interest in contributing to **ngx-datepicker-calendar**! We welcome contributions from the community. This guide will help you get started with setting up the project locally and understanding our contribution standards.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Local Development Setup](#local-development-setup)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
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
