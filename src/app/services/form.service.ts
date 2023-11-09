import { Injectable } from '@angular/core';
import { Form } from './../models/form.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  formList: Array<Form> = [];

  constructor(private httpClient: HttpClient) {
  }

  getForm(itemIndex?: number) {
    return this.formList[itemIndex];
  }

  getUsersForm(isLoggedIn: Boolean) {
    if (isLoggedIn) {
      this.httpClient.get(environment.getForm)
        .toPromise().then((form: Form[]) => {
          this.formList = form;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  async removeForm(isLoggedIn?: boolean, itemIndex?: number) {
    if (!isLoggedIn) {
      this.formList.splice(itemIndex, 1);
    }
    else {
      const body = {
        id: itemIndex == undefined ? '' : this.formList[itemIndex]._id.toString(),
        index: itemIndex == undefined ? '-1' : itemIndex.toString()
      };
      await this.httpClient.delete(environment.removeForm, { params: body })
        .toPromise().then((result) => {
          if (itemIndex == undefined) this.formList = [];
          else this.formList.splice(itemIndex, 1);
        }).catch(err => {
          console.log(err);
        });
    }
  }

  async updateForm(itemIndex: number, updatedForm: Form) {
    const body = {
      id: itemIndex == undefined ? '' : this.formList[itemIndex]._id.toString(),
      name: updatedForm.name.toString(),
      mobile: updatedForm.mobile.toString(),
      applicationAmount: updatedForm.applicationAmount.toString(),
      profileImg: updatedForm.profileImg.toString()
    };
    await this.httpClient.put(environment.updateForm, body)
      .toPromise().then(result => {
        this.formList[itemIndex] = updatedForm;
      }).catch(err => {
        console.log(err);
      });
  }

  async addForm(newForms: Form[], token: String, signup?: boolean) {
    if (token === null) {
      this.formList = this.formList.concat(newForms);
    } else {
      if (newForms.length !== 0)
        await this.httpClient.post(environment.addForm, newForms)
          .toPromise().then((result) => {
            signup ? this.formList = result['forms'] :
              this.formList = this.formList.concat(result['forms']);
          }).catch(err => {
            console.log(err);
          });
    }
  }
}
