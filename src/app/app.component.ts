import { Component, OnInit } from '@angular/core';
import { TaskModel, TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'taskmanager-hybrid';

  tasks: TaskModel[] = [];
  filteredTasks: TaskModel[] = [];

  showCompleted = true;
  priorityFilter = '';
  searchTerm = '';
  sortBy: keyof TaskModel = 'dueDate';

  newTask: Partial<TaskModel> = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load tasks:', err),
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesCompleted = this.showCompleted || !task.completed;
      const matchesPriority =
        !this.priorityFilter || task.priority === this.priorityFilter;
      const matchesSearch =
        !this.searchTerm ||
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesCompleted && matchesPriority && matchesSearch;
    });
  }

  getCompletedCount(): number {
    return this.filteredTasks.filter((t) => t.completed).length;
  }

  addTask(): void {
    if (!this.newTask.title?.trim()) return;

    this.taskService.addTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTask = { title: '', description: '', priority: 'medium', dueDate: '' };
        this.applyFilters();
      },
      error: (err) => console.error('Failed to add task:', err)
    });
  }

  toggleComplete(task: TaskModel): void {
    console.log('Task: ', task);
    this.taskService.toggleTaskComplete(task).subscribe({
      next: (updated) => {

        const index = this.tasks.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          this.tasks[index] = updated;
          this.applyFilters();
        }
      },
      error: (err) => console.error('Failed to toggle task:', err)
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.applyFilters();
      },
      error: (err) => console.error('Failed to delete task:', err)
    });
  }

  searchTasks(): void {
    this.applyFilters();
  }
}
