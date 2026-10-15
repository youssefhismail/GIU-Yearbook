# Assignment 1: Build the Student Card Component
## Questions & Reflection Answers

---

### Question 1 (Page 3)
> **Why does the selector start with `app-`? (Hint: look at the selectors of `app-header` and `app-top-strip`.)**

**Answer:**
1. **HTML Standards & Custom Elements:** According to the W3C Web Components standard, custom elements must contain a hyphen (`-`) to ensure they are never confused with present or future standard HTML elements (such as `<header>`, `<main>`, `<dialog>`, etc.).
2. **Preventing Name Collisions:** Prefixing components with `app-` (configured in `angular.json` under `"prefix": "app"`) prevents name collisions with native HTML tags, third-party libraries, and other custom elements.
3. **Consistent Namespacing:** It creates a clear namespace for application-defined components across the codebase (e.g., `<app-header>`, `<app-top-strip>`, and `<app-student-card>`), signaling to developers that this is a custom Angular component built for this application.

---

### Step 2: Meet the Data — Notebook Questions (Page 4)

#### 1. Which fields will be displayed on the card?
* `photo`: The relative path to the student's portrait image, rendered inside the `<img>` element.
* `name`: The student's full name, rendered inside the `<h3>` heading.
* `faculty`: The faculty/school name (e.g., "Engineering"), rendered in the metadata line.
* `classYear`: The graduation year (e.g., "2028"), rendered in the metadata line as `"Class of {{ student().classYear }}"`.
* `quote`: The student's personal yearbook quote, rendered inside curly quotation marks `“{{ student().quote }}”`.

#### 2. Which field will be used to build the link to the student's story?
* `id`: The unique numeric identifier of the student. It is used in the router parameter array `[routerLink]="['/students', student().id]"` to generate URLs like `/students/1`, `/students/2`, etc.

#### 3. Which field decides the order when sorting by "Featured first"? (The card does not show it.)
* `featured`: A boolean flag (`true` or `false`). When "Featured first" is chosen in the sort dropdown, the parent component (`StudentsPage`) sorts featured students first using `Number(b.featured) - Number(a.featured)`. The card itself does not visually display this property.

---

### Question 2 (Page 5)
> **What would happen if the parent changed which student it passes? Would the card update by itself?**

**Answer:**
* **Yes, the card updates automatically.**
* The input is defined using Angular's signal-based input API: `readonly student = input.required<Student>();`.
* Signal inputs participate directly in Angular's fine-grained reactivity graph. Whenever the parent component (`StudentsPage`) passes a new student object (e.g., when filtering by search text, changing the faculty filter, or re-sorting), the `student` signal emits a change.
* Angular automatically re-evaluates all template expressions that read `student()` (such as `{{ student().name }}`, `photoSrc()`, and `routerLink`) and updates the DOM with no need for manual change detection triggers or `ngOnChanges` hooks.

---

### Question 3 (Page 9)
> **The arrow icon has no color in its SVG code, yet it is red. Why? (Hint: Step 8, `currentColor`.)**

**Answer:**
* In `student-card.html`, the SVG element uses `stroke="currentColor"`.
* The CSS keyword `currentColor` resolves to the computed value of the CSS `color` property on that element (or inherited from its closest ancestor).
* In `student-card.css`, the `.card__arrow` selector sets:
  ```css
  .card__arrow {
    width: 18px;
    height: 18px;
    color: var(--color-red);
  }
  ```
* Because `color` is defined as `var(--color-red)`, the SVG's `stroke="currentColor"` resolves dynamically to the design token `--color-red` (`#B52430`), making the arrow red without hardcoding colors into the SVG markup.

---

### Question 4 (Page 11)
> **Why do we use `computed` for `photoSrc` instead of just assigning a value in the constructor?**

**Answer:**
* In Angular's signal architecture, signal inputs (such as `student()`) and state signals (such as `imageFailed()`) are reactive and change over time.
* If `photoSrc` were assigned in the constructor (e.g., `this.photoSrc = this.student().photo;`):
  1. The constructor executes only once during component creation.
  2. If the image fails to load and `onImageError()` updates `imageFailed` to `true`, a regular property assigned in the constructor would never update, leaving the image permanently broken.
  3. If the parent component later re-uses the component or swaps the student instance, a plain property would remain stuck with the initial student's photo.
* By using `computed(() => this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo)`, `photoSrc` dynamically tracks both the `imageFailed` and `student` signals. Whenever either signal changes, `photoSrc` recalculates immediately, cleanly rendering the fallback placeholder image or the updated student photo.

---

### Reflection Questions (Page 12)

#### 1. Why does the card receive the student through an input instead of loading it from `StudentService` itself?
The `StudentCard` is designed as a reusable presentational component whose sole responsibility is rendering a single student's data. The parent page (`StudentsPage`) acts as the smart container that fetches all student records once via `StudentService`, handles global filtering, sorting, and counts, and distributes individual student objects to cards via `[student]="s"`. If each card loaded its own student from the service, it would result in duplicate HTTP requests, would make client-side filtering and sorting impossible at the page level, and would tightly couple the card to a specific data-fetching strategy.

#### 2. What is the advantage of having a separate card component instead of writing the card markup inside the students page?
Extracting the card into `<app-student-card>` provides modularity, maintainability, and clean separation of concerns. The card encapsulates its own internal state (managing image load errors with `imageFailed`), its template structure, and its own scoped CSS styles (`student-card.css`), preventing `students-page.html` from becoming cluttered. Moreover, the card component can easily be reused elsewhere in the application—such as in search modals, bookmarks, or alumni lists—without duplicating HTML, CSS, or fallback logic.

#### 3. If the backend adds a new field, `graduationDate`, which files would you change to show it on the card?
1. **`src/app/models/student.model.ts`**: Add `graduationDate: string;` (or `Date`) to the `Student` interface so TypeScript provides type checking and autocompletion.
2. **`src/app/components/student-card/student-card.html`**: Add the new field to the template (for instance, inside `<p class="card__meta">` or in a new element) using interpolation: `{{ student().graduationDate }}`.
3. **`src/app/components/student-card/student-card.css`**: (If needed) add styling rules for the new graduation date element using existing design tokens.
*(Optionally, update `public/mock-api/students.json` with sample values for local testing).*

#### 4. Which step was hardest for you, and what did you do to get unstuck?
Step 13 (handling missing images with a signal, computed property, and the `(error)` event) was the most challenging step because it requires linking DOM event handling with Angular's reactive signal graph. Getting unstuck involved breaking down the data flow: the browser DOM emits an asynchronous `(error)` event when an image fails to load; this event triggers `onImageError()` which updates the `imageFailed` signal to `true`; and the `computed` property `photoSrc` automatically detects this state change and provides `'images/placeholder-portrait.svg'` to the `[src]` binding without manual DOM manipulation.
