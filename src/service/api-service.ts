import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(public http: HttpClient) {
  }

  getData(url) {
    return this.http.get<any>(url);
  }

}
