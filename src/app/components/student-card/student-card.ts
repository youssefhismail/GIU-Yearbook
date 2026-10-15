/* =====================================================================
   FILE: src/app/components/student-card/student-card.ts
   WHAT: The logic for an individual student card component.
   WHY:  Receives student data via a required signal input, manages image
         fallback state reactively with signals and computed, and exposes
         safe properties for template rendering and routing.
   ===================================================================== */
import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  // The parent page will give us one student through this required input.
  readonly student = input.required<Student>();

  // State: Did the portrait fail to load?
  // We keep track of this in a signal to reactively switch to a fallback.
  private readonly imageFailed = signal(false);

  // Derived state: The photo URL actually displayed.
  // Recomputes automatically if imageFailed changes or if the student changes.
  protected readonly photoSrc = computed(() =>
    this.imageFailed() ? 'images/placeholder-portrait.svg' : this.student().photo,
  );

  // Event handler called by the template when the <img> fails to load.
  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}