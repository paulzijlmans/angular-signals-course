import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Lesson } from "../models/lesson.model";
import { LessonsService } from "../services/lessons.service";
import { LessonDetailComponent } from "./lesson-detail/lesson-detail.component";

@Component({
  selector: 'lessons',
  standalone: true,
  imports: [
    LessonDetailComponent
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent {
  lessonsService = inject(LessonsService)

  mode = signal<'master' | 'detail'>('master')
  lessons = signal<Lesson[]>([])
  selectedLesson = signal<Lesson | null>(null)

  searchInput = viewChild.required<ElementRef>('search')

  async onSearch() {
    const query = this.searchInput()?.nativeElement.value;
    const results = await this.lessonsService.loadLessons({ query })
    this.lessons.set(results)
  }

  onLessonSelected(lesson: Lesson) {
    this.mode.set("detail")
    this.selectedLesson.set(lesson)
  }

  onCancel() {
    this.mode.set("master")
  }

  onLessonUpdated(updatedLesson: Lesson) {
    this.lessons.update(lessons => lessons
      .map(lesson => lesson.id === updatedLesson.id ? updatedLesson : lesson))
    this.mode.set("master")
  }
}
