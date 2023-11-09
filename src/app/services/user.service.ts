import { Injectable } from '@angular/core';
import { User } from './../models/user.model';
import { TodoService } from './todo.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User = {
    fullName: ''
  }

  noAuthHeader = { headers: new HttpHeaders({ 'noauth': 'True' }) };

  constructor(private todoService: TodoService, private httpClient: HttpClient) {
  }

  setToken(token: string, isLoggedIn?: boolean) {
    localStorage.setItem('token', token);
    if (isLoggedIn) localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }

  getToken() {
    const token = localStorage.getItem('token');
    return JSON.parse(token);
  }

  deleteTokens() {
    localStorage.clear();
  }

  async signupUser(user: User) {
    return this.httpClient.post(environment.signup, user, this.noAuthHeader)
      .toPromise().then(async (result: any) => {
        this.currentUser = {
          fullName: result.user.fullName
        }
        this.setToken(JSON.stringify(result.token), true);
        await this.todoService.addToDo(this.todoService.todoList, result.token.jwt, true);
      })
  }

  async loginUser(user: User) {
    return this.httpClient.post(environment.baseUrl + 'user/authenticate', {
      email: user.email,
      password: user.password
    }, this.noAuthHeader)
      .toPromise().then(res => {
        this.setToken(JSON.stringify(res['token']), true);
        this.currentUser = { fullName: res['user'].fullName }
        this.todoService.getUsersToDos(true);
      });
  }

  getUserProfile() {
    return this.httpClient.get(environment.baseUrl + 'user/userProfile')
      .toPromise().then(res => {
        this.currentUser = res['user'];
      });
  }

  logoutUser() {
    this.currentUser = {
      fullName: '',
    }
    this.deleteTokens();
    this.todoService.removeToDo(true);
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.jwt.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    const hasToken = this.getUserPayload() !== null

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isLoggedInStored = isLoggedIn == null ? false : true;

    return hasToken && isLoggedInStored;
  }

  isTokenExpired() {
    var userPayload = this.getUserPayload();
    return (userPayload.exp < (Date.now() / 1000));
  }

  refreshToken() {
    return this.httpClient.get(environment.baseUrl + 'user/refreshToken', {
      "headers": new HttpHeaders({ "Authorization": "Bearer " + this.getToken().jwt }),
      "params": new HttpParams({ fromObject: { 'refreshToken': this.getToken().refreshToken } })
    });
  }
}