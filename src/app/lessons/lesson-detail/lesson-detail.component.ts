import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { MessagesService } from "../../messages/messages.service";
import { Lesson } from "../../models/lesson.model";
import { LessonsService } from "../../services/lessons.service";

@Component({
  selector: 'lesson-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss'
})
export class LessonDetailComponent {
  lessonsService = inject(LessonsService)
  messagesService = inject(MessagesService)

  lesson = input.required<Lesson | null>()
  lessonUpdated = output<Lesson>()
  cancel = output<void>()

  onCancel() {
    this.cancel.emit()
  }

  async onSave(description: string) {
    try {
      const updatedLesson = await this.lessonsService.saveLesson(this.lesson()!.id, { description })
      this.lessonUpdated.emit(updatedLesson)
    } catch (error) {
      console.error(error)
      this.messagesService.showMessage('Error saving lesson!', 'error')
    }
  }
}
