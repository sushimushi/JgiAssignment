import { Injectable } from '@angular/core';
import { ToDo } from './../models/todo.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todoList: Array<ToDo> = [];
  readonly todoStatus = { DONE: 'done', PENDING: 'pending', DOING: 'doing' };

  constructor(private httpClient: HttpClient) {
    // Uncomment below lines for testing.
    // const newToDo: ToDo = {
    //   title: 'Some Dummy Title',
    //   description: 'Some Description',
    //   status: this.todoStatus.PENDING,
    //   createdOn: Date.now()
    // }
    // this.todoList.push(newToDo);
  }

  getToDo(itemIndex?: number) {
    return this.todoList[itemIndex];
  }

  getUsersToDos(isLoggedIn: Boolean) {
    if (isLoggedIn) {
      this.httpClient.get(environment.getTodo)
        .toPromise().then((todos: ToDo[]) => {
          this.todoList = todos;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  async removeToDo(logout?: Boolean, isLoggedIn?: boolean, itemIndex?: number) {
    if (logout) {
      this.todoList = [];
    } else if (!isLoggedIn) {
      this.todoList.splice(itemIndex, 1);
    }
    else {
      const body = {
        id: itemIndex == undefined ? '' : this.todoList[itemIndex]._id.toString(),
        index: itemIndex == undefined ? '-1' : itemIndex.toString()
      };
      await this.httpClient.delete(environment.removeToDO, { params: body })
        .toPromise().then((result) => {
          if (itemIndex == undefined) this.todoList = [];
          else this.todoList.splice(itemIndex, 1);
        }).catch(err => {
          console.log(err);
        });
    }
  }

  async updateToDo(itemIndex: number, updatedToDo: ToDo) {
    const body = {
      id: itemIndex == undefined ? '' : this.todoList[itemIndex]._id.toString(),
      title: updatedToDo.title.toString(),
      description: updatedToDo.description.toString(),
      status: updatedToDo.status.toString()
    };
    await this.httpClient.put(environment.updateToDo, body)
      .toPromise().then(result => {
        this.todoList[itemIndex] = updatedToDo;
      }).catch(err => {
        console.log(err);
      });
  }

  async addToDo(newToDos: ToDo[], token: String, signup?: boolean) {
    if (token === null) {
      this.todoList = this.todoList.concat(newToDos);
    } else {
      if (newToDos.length !== 0)
        await this.httpClient.post(environment.addToDo, newToDos)
          .toPromise().then((result) => {
            signup ? this.todoList = result['todos'] :
              this.todoList = this.todoList.concat(result['todos']);
          }).catch(err => {
            console.log(err);
          });
    }
  }
}
