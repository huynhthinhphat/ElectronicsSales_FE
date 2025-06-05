import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  constructor() { }

  private createSignature(orderId: string): string {
    return CryptoJS.HmacSHA256(orderId, environment.secretKey).toString(CryptoJS.enc.Hex);
  }

  verifySignature(orderId: string, signature: string): boolean {
    const expected = this.createSignature(orderId);
    return expected === signature;
  }
}
