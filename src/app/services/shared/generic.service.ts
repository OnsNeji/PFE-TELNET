import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class GenericService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  getService(url: string): Observable<any> {
    return this.http.get(url);
  }

  getServiceWithDynamicQueryTerm(url: string, key: string, val: string): Observable<any> {
    return this.http.get(url + '/?' + key + '=' + val);
  }

  createService(url: string, param: any): Observable<any> {
    const body = JSON.stringify(param);
    return this.http
      .post(url, body, { headers: this.headers });
  }

  uploadService(url, formData): Observable<any> {
    return this.http
      .post(url, formData, {reportProgress: true, observe: 'events'});
  }

  updateService(url: string, param: any): Observable<any> {
    const params: HttpParams = new HttpParams();
    const body = JSON.stringify(param);
    return this.http
      .put(url, body, { params: params });
  }

  patchService(url: string, param: any): Observable<any> {
    const params: HttpParams = new HttpParams();
    const body = JSON.stringify(param);
    return this.http
      .patch(url, body, { params: params });
  }

  deleteService(url: string, param: any): Observable<any> {
    const params: HttpParams = new HttpParams();
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        const val = param[key];
        params.set(key, val);
      }
    }
    return this.http
      .delete(url, { params: params });
  }

  deleteServiceWithId(url: string, key: string, val: string): Observable<any> {
    const params: HttpParams = new HttpParams();
    return this.http
      .delete(url + '/?' + key + '=' + val, { params: params });
  }
}
