import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable, Injector } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { UserService } from '../services/user.service';
import { Observable, empty } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refreshingToken = false;

  constructor(private injector: Injector, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.get('noauth') || (req.url.indexOf('refreshToken') !== -1))
      return next.handle(req);
    else {
      if (this.injector.get(UserService).isLoggedIn()) {
        const tokenExpired = this.injector.get(UserService).isTokenExpired();

        if (!tokenExpired) {
          const clonedreq = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + this.injector.get(UserService).getToken().jwt)
          });
          return next.handle(clonedreq);
        }
        else {
          if (!this.refreshingToken)
            return this.injector.get(UserService).refreshToken().pipe(switchMap((token: any, index) => {
              this.refreshingToken = false;
              this.injector.get(UserService).setToken(JSON.stringify(token));
              const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + this.injector.get(UserService).getToken().jwt)
              });
              return next.handle(clonedreq);
            }))
        }
      }
      else return empty();
    }
  }
}