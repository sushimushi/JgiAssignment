import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToDo } from '../models/todo.model';

@Component({
  selector: 'todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.css']
})
export class TodoListItemComponent {
  @Input('todo') public todoData: ToDo;
  @Input('index') public todoIndex: Number;
  @Input('expandedIndex') public expandedIndex: Number;
  @Output() public expandedThis = new EventEmitter();
  @Output() public statusChanged = new EventEmitter();
  @Output() public removeThis = new EventEmitter();

  removeToDo() {
    this.removeThis.emit();
  }

  expandToDo() {
    if (this.todoData.description !== "") {
      if (this.expandedIndex == this.todoIndex) this.expandedThis.emit(-1);
      else this.expandedThis.emit(this.todoIndex);
    }
  }

  changeStatus(status) {
    if (this.todoData.status === status) this.statusChanged.emit('pending');
    else this.statusChanged.emit(status);
  }
}
