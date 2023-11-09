import { Component, OnInit } from '@angular/core';

import { TodoService } from '../services/todo.service';
import { FormService } from '../services/form.service';
import { UserService } from '../services/user.service';
import { DataService } from '../data.service';
import { PDFDocument, rgb } from 'pdf-lib';
import { Router } from '@angular/router';

import {
  FormGroup,
  FormControl,
  FormControlName,
  Validator,
  Validators,
} from '@angular/forms';
import { Form } from '../models/form.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  thisTitle = '';
  thisDescription = '';

  showMore = false;
  expandedIndex = -1;

  registration = new FormGroup({
    name: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.userService.getUserProfile().catch((err) => console.log(err));
      this.todoService.getUsersToDos(true);
      this.formService.getUsersForm(true);
    }
  }

  constructor(
    public todoService: TodoService,
    public formService: FormService,
    public userService: UserService,
    private dataService: DataService,
    private router: Router
  ) {}

  edit(data: Form){
    this.dataService.sharedData = {data};
    this.dataService.isEdit = true;
    this.router.navigate(['/register']);
  }

  removeForm(index: number) {
    this.formService.removeForm(this.userService.isLoggedIn(), index);
  }
  onSubmit() {}

  get name() {
    return this.registration.get('name');
  }

  exportcsv() {
    const formList = this.formService.formList.map((item) => {
      return {
        name: item.name,
        number: item.mobile,
        applicationAmount: item.applicationAmount,
        profileImg: item.profileImg,
        email: item.email,
        createdOn: item.createdOn,
      };
    });
    const header = Object.keys(formList[0]).join(',');
    const result = `${header}\n${formList
      .map((item) => Object.values(item).join(','))
      .join('\n')}`;

    console.log(result);

    const blob = new Blob([result], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mydata.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async downloadPdf(currentForm) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1000, 600]);
    const { width, height } = page.getSize();

    const fontSize = 30;
    page.drawText(
      `
      name: ${currentForm.name}, \n
      number: ${currentForm.mobile}, \n
      applicationAmount: ${currentForm.applicationAmount}, \n
      profileImg: ${currentForm.profileImg}, \n
      email: ${currentForm.email}, \n
      createdOn: ${currentForm.createdOn}, \n
      `,
      {
        x: 50,
        y: height - 50,
        size: fontSize,
        color: rgb(0, 0, 0),
      }
    );

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Create a Blob and URL for the PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger a click to download the PDF file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-pdf.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
