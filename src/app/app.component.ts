import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize, Observable, pipe, throwError } from 'rxjs';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Todo{
  title:string
}

interface TodoResponse{
  success: boolean
  message: string
}

interface AllTodo{
  title: string
  id: string
  completed: boolean
}



export class TodoService{
  // private apiUrl = 'https://todo-blond-chi.vercel.app'; this is the other API I used when i was unable to make any changes to the API you gave me
  private apiUrl = 'https://jsonplaceholder.typicode.com';


constructor(private http: HttpClient) {}

addTodo(data: Todo): Observable<TodoResponse> {
  return this.http.post<TodoResponse>(`${this.apiUrl}/posts`, data).pipe(
    catchError((error) => {
      console.error('Error adding todo:', error);
      return throwError(error);
    }),
    finalize(() => {
      console.log('Todo add operation completed');
    })
  );
}

getTodos(): Observable<AllTodo[]> {
  return this.http.get<AllTodo[]>(`${this.apiUrl}/posts`).pipe(
    catchError((error) => {
      console.error('Error fetching todos:', error);
      return throwError(error);
    }),
    finalize(() => {
      console.log('Todos fetch operation completed');
    })
  );
}

deleteTodo(id:string): Observable<TodoResponse> {
  return this.http.delete<TodoResponse>(`${this.apiUrl}/posts/${id}`).pipe(
    catchError((error) => {
      console.error('Error deleting todo:', error);
      return throwError(error);
    }),
    finalize(() => {
      console.log('Todos deleted successfully');
    })
  );
}
}

@Component({
selector: 'app-root',
standalone: true,
imports: [HttpClientModule, CommonModule, FormsModule],
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']

})

export class AppComponent implements OnInit {
todos: AllTodo[] = [];
newTodo: Todo = { title: '' };

constructor(private httpClient: HttpClient) {}

ngOnInit() {
  this.getTodos();
}

getTodos() {
  const todoService = new TodoService(this.httpClient);
  todoService.getTodos().subscribe(
    (todos) => {
      this.todos = todos;
      console.log('All todos:', this.todos);
    },
    (error) => {
      console.error('Error fetching todos:', error);
    }
  );
}


addTodo() {
  if (!this.newTodo.title) {
    console.warn('Title is required to add a todo.');
    return;
  }
  
  const todoService = new TodoService(this.httpClient);
  todoService.addTodo(this.newTodo).subscribe(
    (response) => {
      console.log('Todo added:', response);
      this.getTodos();
      this.newTodo.title = ''; 
    },
    (error) => {
      console.error('Error adding todo:', error);
    }
  );
}

deleteTodo(id: string) {
  const todoService = new TodoService(this.httpClient);
  todoService.deleteTodo(id).subscribe(
    (response) => {
      console.log('Todo deleted:', response);
      this.getTodos(); 
    },
    (error) => {
      console.error('Error deleting todo:', error);
    }
  );
}
}