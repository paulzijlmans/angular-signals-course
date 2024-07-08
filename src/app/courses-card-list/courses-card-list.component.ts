import { Component, inject, input, output } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { Course } from "../models/course.model";

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>()
  courseUpdated = output<Course>()
  courseDeleted = output<string>()
  dialog = inject(MatDialog)

  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: "update",
      title: "Update Existing Course",
      course
    })
    this.courseUpdated.emit(newCourse)
  }

  onDeleteCourse(courseId: string) {
    this.courseDeleted.emit(courseId)
  }
}
