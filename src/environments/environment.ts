// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // API URLs
  baseUrl: 'http://localhost:3000/api/',
  signup: 'http://localhost:3000/api/user/signup',
  login: 'http://localhost:3000/api/user/login',
  getTodo: 'http://localhost:3000/api/todo/get',
  removeToDO: 'http://localhost:3000/api/todo/remove',
  addToDo: 'http://localhost:3000/api/todo/add',
  updateToDo: 'http://localhost:3000/api/todo/update',
  getForm: 'http://localhost:3000/api/form/get',
  removeForm: 'http://localhost:3000/api/form/remove',
  addForm: 'http://localhost:3000/api/form/add',
  updateForm: 'http://localhost:3000/api/form/update',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
