import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  private API_KEY: string = 'lCHM3HtYrt1AIKs6eCX1WClxOwkY3osiPo63Wdfs';
  private BASE_URL = 'https://rsapi.goong.io';

  autoComplete(input: string) {
    return this.http.get(`${this.BASE_URL}/Place/AutoComplete`, {
      params: {
        input: input,
        api_key: this.API_KEY
      }
    });
  }
}
