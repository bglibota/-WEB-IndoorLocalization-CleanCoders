import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiURL: string = 'http://localhost:5039/';

  constructor() {}

 public getApiURL(): string {
    return this.apiURL;
  }


}
