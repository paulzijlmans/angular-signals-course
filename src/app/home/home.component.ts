import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { MessagesService } from '../messages/messages.service';
import { Course, sortCoursesBySeqNo } from "../models/course.model";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  coursesService = inject(CoursesService)
  dialog = inject(MatDialog)
  messagesService = inject(MessagesService)

  #courses = signal<Course[]>([])
  beginnerCourses = computed(() => this.#courses().filter(course => course.category === 'BEGINNER'))
  advancedCourses = computed(() => this.#courses().filter(course => course.category === 'ADVANCED'))

  constructor() {
    this.loadCourses()
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses()
      this.#courses.set(courses.sort(sortCoursesBySeqNo))
    } catch (error) {
      this.messagesService.showMessage('Error loading courses!', 'error')
      console.error(error)
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: "create",
      title: "Update Existing Course"
    })
    this.#courses.update(courses => [...courses, newCourse])
  }

  onCourseUpdated(updatedCourse: Course) {
    this.#courses.update(courses =>
      courses.map(course => course.id === updatedCourse.id ? updatedCourse : course))
  }

  async onDeleteCourse(deletedCourseId: string) {
    try {
      await this.coursesService.deleteCourse(deletedCourseId)
      this.#courses.update(courses => courses.filter(course => course.id !== deletedCourseId))
    } catch (error) {
      this.messagesService.showMessage('Error deleting courses!', 'error')
      console.error(error)
    }
  }
}
