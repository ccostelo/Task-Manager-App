import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AppState } from '../store/task.store.d';
import { addTask, deleteTask, setTasks, updateTask, store, setUsers, setCategories } from '../store/task.store';

export interface TaskModel {
  id: string;
  title: string;
  description: string;
  priority: string;
  user?: string | '';
  category?: string | '';
  completed: boolean;
  createdAt: string;
  dueDate: string;
  completedAt?: string | null;
  updatedAt?: string;
}

export interface UserModel {
  id: string;
  name : string;
  email: string;
  role: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService2 {
  private readonly apiUrl = 'http://localhost:3000';

  private stateSubject = new BehaviorSubject<AppState>(store.getState());
  public state$ = this.stateSubject.asObservable();

  constructor(private http: HttpClient) {
    store.subscribe(() => {
      this.stateSubject.next(store.getState());
    });
  }

  getState() : AppState {
    return store.getState();
  }

  getState$() : Observable<AppState>{
    return this.state$;
  }

  fetchTasks(): TaskModel[] {
    return store.getState().tasks;
  }

  fetchTasks$(): Observable<TaskModel[]> {
    return this.state$.pipe(map(state => state.tasks));
  }

  loadAllTasks() {
    return this.http.get<TaskModel[]>(`${this.apiUrl}/tasks`).pipe(
      tap(tasks => store.dispatch(setTasks(tasks)))
    );
  }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/users`)
    .pipe(tap(users => store.dispatch(setUsers(users))));
  }

  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/categories`)
    .pipe(tap(categories => store.dispatch(setCategories(categories))));
  }

  getAllTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(`${this.apiUrl}/tasks`);
  }

  getTaskByIdHttp(id: number): Observable<TaskModel> {
    return this.http.get<TaskModel>(`${this.apiUrl}/tasks/${id}`);
  }

  addTask(task: Partial<TaskModel>): Observable<TaskModel> {
    return this.http
      .post<TaskModel>(`${this.apiUrl}/tasks`, {
        ...task,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      })
      .pipe(
        tap((newTask) => {
          store.dispatch(addTask(newTask));
        })
      );
  }

  updateTask(id: string, updates: Partial<TaskModel>): Observable<TaskModel> {
    return this.http
      .put<TaskModel>(`${this.apiUrl}/tasks/${id}`, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .pipe(
        tap((updatedTask) => {
          store.dispatch(updateTask(updatedTask));
        })
      );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`)
      .pipe(
        tap(() => {
          store.dispatch(deleteTask(id));
        })
      );
  }

  toggleTaskComplete(task: TaskModel): Observable<TaskModel> {
    const updatedTask: TaskModel = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    };
    return this.updateTask(task.id, updatedTask);
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
