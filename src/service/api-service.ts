import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {

  constructor(public http: HttpClient) {
  }

  getData(url) {
    return this.http.get<any>(url);
  }

}
