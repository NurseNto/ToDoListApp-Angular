import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/task';
import { TodoService } from 'src/app/todo.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {

  tasks: Task[] = [];
  editingTaskId: number | null = null;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.todoService.getTasks().subscribe(tasks => this.tasks = tasks.filter(task => !task.archived));
  }
  

  addTask(title: string, description: string): void {
    const task: Task = { title, description, likes: 0 };
    this.todoService.addTask(task).subscribe(() => {
      this.getTasks();
    });
  }

  editTask(task: Task): void {
    this.editingTaskId = task.id;
  }

  updateTask(task: Task): void {
    this.todoService.updateTask(task).subscribe(() => {
      this.getTasks();
      this.editingTaskId = null;
    });
  }
  

  cancelEdit(): void {
    this.editingTaskId = null;
  }

  deleteTask(id: number): void {
    this.todoService.deleteTask(id).subscribe(() => {
      this.getTasks();
    });
  }

  toggleLike(task: Task): void {
    this.todoService.toggleLike(task).subscribe(() => {
      this.getTasks();
    });
  }

  archiveTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.archived = true;
      this.todoService.updateTask(task).subscribe(() => {
        this.getTasks();
      });
    }
  }
  
}
