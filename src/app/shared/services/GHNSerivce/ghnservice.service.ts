import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GHNService {

  constructor(private http: HttpClient) { }

  private TOKEN = 'e762a303-2cff-11f0-9058-46b90fbc47f5';
  private SHOPID = '5765625';
  private API_GET_PROVINCE = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';
  private API_GET_DISTRICT = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
  private API_GET_WARD = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
  private API_ESTIMATE_TIME = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Token': this.TOKEN,
    'ShopId': this.SHOPID
  });

  getProvince(): Observable<any> {
    return this.http.get<any>(`${this.API_GET_PROVINCE}`, { headers: this.headers });
  }

  getDistrict(data: { province_id: number }): Observable<any> {
    return this.http.post<any>(`${this.API_GET_DISTRICT}`, data, { headers: this.headers });
  }

  getWard(data: { district_id: number }): Observable<any> {
    return this.http.post<any>(`${this.API_GET_WARD}`, data, { headers: this.headers });
  }

  estimateTime(data: { from_district_id: number, from_ward_code: string, to_district_id: number, to_ward_code: number, service_id: number }): Observable<any> {
    return this.http.post<any>(`${this.API_ESTIMATE_TIME}`, data, { headers: this.headers });
  }
}
