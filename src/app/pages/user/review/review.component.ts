import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from '../../../shared/services/ImageService/image.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from '../../../models/Message.model';
import { Review } from '../../../models/Review.model';
import { ReviewService } from '../../../shared/services/ReviewServive/review.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private toastr: ToastrService,
    private reviewService: ReviewService,
    private location: Location
  ) { }

  id: string = '';
  description = '';
  review: Review | null = null;
  numberStarTemp: number = -1;
  selectedImages: File[] = [];
  selectedImagesMain: File[] = []
  selectedImageUrls: string[] = [];
  selectedImageUrlsTemp: string[] = [];
  stars = [1, 2, 3, 4, 5];
  max: number = 250;

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];

      if (this.id) {
        this.reviewService.viewReviewOfUser(this.id).subscribe({
          next: (res) => {
            if (res?.status === 'success' && res?.data) {
              this.review = res.data;
              this.selectedImageUrls = [...this.review.images as string[]];
              this.selectedImageUrlsTemp = [...this.review.images as string[]];
              this.numberStarTemp = this.review.star as number;
              this.description = this.review.description as string;
            }
          },
          error: () => {
            window.location.href = '/404'
          }
        })
      }
    });
  }

  enterStars(index: number) {
    this.numberStarTemp = index;
  }

  leaveStars() {
    this.numberStarTemp = this.review!.star as number;
  }

  chooseNumberStars(index: number) {
    if (!this.review) return;

    if (this.review.star === index) {
      this.review.star = this.numberStarTemp = -1;
      return;
    }
    this.review.star = index;
  }

  uploadImages(event: Event) {
    const files = this.imageService.onFilesSelected(event);

    if (files.length + this.selectedImageUrls.length > 6) {
      this.toastr.info(Message.MAX_FILES_LENGTH);
      return;
    }

    if (this.selectedImages.length === 0) {
      this.selectedImages.push(...files);
    } else {
      this.selectedImages = [...this.selectedImages, ...files];
    }
    this.selectedImageUrls.push(...this.selectedImages.map((file: Blob | MediaSource) => URL.createObjectURL(file)));

    (event.target as HTMLInputElement).value = '';
    this.selectedImagesMain.push(...this.selectedImages);
    this.selectedImages = [];
  }

  deleteImage(index: number) {
    this.selectedImagesMain.splice(this.selectedImageUrlsTemp.length + index - 2, 1);
    this.selectedImageUrls.splice(index, 1);
    this.selectedImageUrlsTemp.splice(index, 1);
  }

  sendReview() {
    if (!this.review) return;

    if (this.review.star == -1) {
      this.toastr.info(Message.MISSING_NUMBER_STARS);
      return;
    }

    const onSuccess = () => {
      if (this.review) {
        this.review.orderDetailId = this.id;
        this.review.description = this.description;

        this.reviewService.createReview(this.review!).subscribe({
          next: (res) => {
            if (res?.status === 'success')
              this.toastr.success(Message.THANK_YOU_FOR_REVIEW);
          },
          error: (error) => {
            console.error(error);
            this.toastr.error("Gửi đánh giá thất bại");
          },
          complete: () => {
            this.location.back();
          }
        });
      }
    };

    if (this.selectedImagesMain.length > 0) {
      this.imageService.uploadMultipleFiles(this.selectedImagesMain).subscribe({
        next: ((urls: string[]) => {
          if (urls.length > 0) {
            this.review!.images = [...this.selectedImageUrlsTemp, ...urls];
          }
          onSuccess();
        })
      })
    } else {
      this.review!.images = [...this.selectedImageUrlsTemp];
      onSuccess();
    }
  }

  toggleText(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    if (value.length > 250) {
      value = value.slice(0, 250);
      target.value = value;
    }
    this.description = target.value;
  }
}
