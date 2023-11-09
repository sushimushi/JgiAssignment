import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Form } from '../models/form.model';
import { FormService } from '../services/form.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'form-list-item',
  templateUrl: './form-list-item.component.html',
  styleUrls: ['./form-list-item.component.css'],
  providers: [UserService, FormService],
})
export class FormListItemComponent {
  constructor(
    public formServices: FormService,
    public userService: UserService
  ) {}

  @Input('form') public formData: Form;
  @Input('index') public formIndex: Number;
  @Input('expandedIndex') public expandedIndex: Number;
  @Output() public expandedThis = new EventEmitter();
  @Output() public statusChanged = new EventEmitter();
  @Output() public removeThis = new EventEmitter();

  removeForm() {
    console.log('here');
    this.formServices.removeForm(
      this.userService.isLoggedIn(),
      +this.formIndex
    );
  }

  expandForm() {
    if (!this.formData) {
      if (this.expandedIndex == this.formIndex) this.expandedThis.emit(-1);
      else this.expandedThis.emit(this.formIndex);
    }
  }
}
