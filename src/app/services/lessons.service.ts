import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "../../environments/environment";
import { GetLessonsResponse } from "../models/get-lessons.response";
import { Lesson } from '../models/lesson.model';


@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  http = inject(HttpClient)

  env = environment;

  async loadLessons(config: { courseId?: string, query?: string }): Promise<Lesson[]> {
    const { courseId, query } = config;
    let params = new HttpParams()
    if (courseId) {
      params = params.set('courseId', courseId)
    }
    if (query) {
      params = params.set('query', query)
    }
    return firstValueFrom(this.http.get<GetLessonsResponse>(`${this.env.apiRoot}/search-lessons`,
      {
        params
      })
      .pipe(map(result => result.lessons)))
  }

  async saveLesson(lessonId: string, changes: Partial<Lesson>): Promise<Lesson> {
    return firstValueFrom(this.http.put<Lesson>(`${this.env.apiRoot}/lessons/${lessonId}`,
      changes
    ))
  }
}
