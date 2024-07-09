import { HttpClient, HttpContext } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { Course } from "../models/course.model";
import { GetCoursesResponse } from "../models/get-courses.response";
import { SkipLoading } from '../loading/skip-loading.component';


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  http = inject(HttpClient)
  env = environment

  loadAllCourses(): Promise<Course[]> {
    return firstValueFrom(this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`,
      {
        context: new HttpContext().set(SkipLoading, false)
      }
    )
      .pipe(map(response => response.courses)))
  }

  createCourse(course: Partial<Course>): Promise<Course> {
    return firstValueFrom(this.http.post<Course>(`${this.env.apiRoot}/courses`, course))
  }

  saveCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    return firstValueFrom(this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, course))
  }

  deleteCourse(courseId: string): Promise<Course> {
    return firstValueFrom(this.http.delete<Course>(`${this.env.apiRoot}/courses/${courseId}`))
  }
}
