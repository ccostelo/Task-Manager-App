import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface TaskModel {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  createdAt: string;
  dueDate: string;
  completedAt?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<TaskModel> {
    return this.http.get<TaskModel>(`${this.apiUrl}/${id}`);
  }

  addTask(task: Partial<TaskModel>): Observable<TaskModel> {
    return this.http.post<TaskModel>(this.apiUrl, {
      ...task,
      completed: false,
      createdAt: new Date().toISOString,
      completedAt: null,
    });
  }

  updateTask(id: number, updates: Partial<TaskModel>): Observable<TaskModel> {
    return this.http.put<TaskModel>(`${this.apiUrl}/${id}`, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleTaskComplete(task: TaskModel): Observable<TaskModel> {
    const updatedTask: TaskModel = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    };
    return this.updateTask(task.id, updatedTask);
  }

  getCompletedTasks(): Observable<TaskModel[]> {
    return this.getAllTasks().pipe(
      map((tasks) => tasks.filter((task) => task.completed))
    );
  }

  getPendingTasks(): Observable<TaskModel[]> {
    return this.getAllTasks().pipe(
      map((tasks) => tasks.filter((task) => !task.completed))
    );
  }

  getTasksByPriority(priority: string): Observable<TaskModel[]> {
    return this.getAllTasks().pipe(
      map((tasks) => tasks.filter((task) => task.priority === priority))
    );
  }

  searchTasks(term: string): Observable<TaskModel[]> {
    return this.getAllTasks().pipe(
      map((tasks) =>
        tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(term.toLowerCase()) ||
            task.description.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  getTaskStats(): Observable<any> {
    return this.getAllTasks().pipe(
      map((tasks) => {
        const completed = tasks.filter((t) => t.completed).length;
        const pending = tasks.filter((t) => !t.completed).length;
        const high = tasks.filter((t) => t.priority === 'high').length;
        const medium = tasks.filter((t) => t.priority === 'medium').length;
        const low = tasks.filter((t) => t.priority === 'low').length;
        const total = tasks.length;
        return {
          total,
          completed,
          pending,
          high,
          medium,
          low,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      })
    );
  }
}
