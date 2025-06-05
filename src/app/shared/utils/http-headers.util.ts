import { HttpHeaders } from '@angular/common/http';

export function buiderHeader(token: string): HttpHeaders {
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
}

