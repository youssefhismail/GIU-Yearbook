import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StudentCard } from './student-card';
import { Student } from '../../models/student.model';

describe('StudentCard', () => {
  let component: StudentCard;
  let fixture: ComponentFixture<StudentCard>;

  const mockStudent: Student = {
    id: 1,
    name: 'Maya Hassan',
    faculty: 'Engineering',
    classYear: 2028,
    quote: 'Build things that make a difference.',
    photo: 'images/students/maya-hassan.jpg',
    featured: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCard);
    fixture.componentRef.setInput('student', mockStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
