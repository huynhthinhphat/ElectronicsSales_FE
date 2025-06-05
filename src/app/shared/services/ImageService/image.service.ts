import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Message } from '../../../models/Message.model';
import { Cloudinary } from '../../../models/Cloudinary.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  private imageUrlSubject = new BehaviorSubject<string>(
    JSON.parse(localStorage.getItem('user') || '{}')?.avatarUrl || ''
  );

  imageUrl$ = this.imageUrlSubject.asObservable();

  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dv8bcgtyh/image/upload';
  private cloudinaryPreset = 'upload-img-electronicsales';
  private BASE_URL = 'http://localhost:8090/api/images';

  updateImageUrl(url: string) {
    this.imageUrlSubject.next(url);
  }

  uploadFileAndGetImageName(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinaryPreset);

    return this.http.post<Cloudinary>(this.cloudinaryUrl, formData).pipe(
      map((res: Cloudinary) => res.secure_url),
      catchError((err) => {
        this.toastr.error(Message.ERROR_FROM_CLOUNDARY);
        return throwError(() => err);
      })
    );
  }

  onFilesSelected(event: Event): any {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      const validFiles = files.filter(file =>
        file.type.startsWith('image/') && file.size / (1024 * 1024) <= 2
      );

      if (validFiles.length !== files.length) {
        this.toastr.error('Một số file không hợp lệ (không phải ảnh hoặc quá 2MB)');
        return;
      }

      return validFiles;
    }
  }

  uploadMultipleFiles(files: File[]) {
    const uploadObservables = files.map(file => this.uploadFileAndGetImageName(file));
    return forkJoin(uploadObservables);
  }

  deleteImages(images: string[]) {
    return this.http.request('DELETE', this.BASE_URL, { body: images });
  }
}
