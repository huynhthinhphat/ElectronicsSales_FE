import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../shared/services/ReviewServive/review.service';
import { Review } from '../../../models/Review.model';

@Component({
  selector: 'app-review-management',
  standalone: false,
  templateUrl: './review-management.component.html',
  styleUrl: './review-management.component.css'
})
export class ReviewManagementComponent implements OnInit {

  constructor(
    private reviewService: ReviewService
  ) { }

  star: string = '';
  page: number = 0;
  limit: number = 20;
  endRecord: number = 0;
  startRecord: number = 1;
  totalElement: number = 0;
  keyWord: string = '';
  isShowDialogDetail: boolean = false;
  review: Review | null = null;
  reviews: Review[] = [];
  selectedImage: string = '';
  reviewIndex: number = -1;
  imageIndex: number = -1;
  max: number = 0;

  ngOnInit(): void {
    this.viewReview();
  }

  searchAccounts() {
    this.keyWord = this.keyWord.trim();
    if (!this.keyWord) {
      return;
    } else {
      this.page = 0;
    }
    this.viewReview();
  }

  viewReview() {
    const recordStartIndex = this.page * this.limit + 1;
    if (recordStartIndex >= this.totalElement && this.totalElement !== 0) {
      this.page = 0;
    }

    this.reviewService.viewReviewsOfAdmin(this.keyWord, this.page, this.limit, this.star).subscribe({
      next: (res => {
        const data = res?.data;
        if (data) {
          this.totalElement = data.pageInfo?.totalElements ?? 0;
          this.reviews = data.items;
          this.startRecord = recordStartIndex > this.totalElement ? 1 : recordStartIndex;
          this.endRecord = Math.min(this.limit * (this.page + 1), this.totalElement);
        }
      })
    })
  }

  closeDialogDetail() {
    this.isShowDialogDetail = false;
    this.review = null;
  }

  viewReviewDetail(id: string) {
    this.reviewService.viewReviewOfAdmin(id).subscribe({
      next: (res => {
        if (res?.data) {
          this.review = res.data;
        }
      }),
      complete: () => {
        this.isShowDialogDetail = true;
      }
    })
  }

  prePage() {
    this.page--;
    this.viewReview();
  }

  nextPage() {
    this.page++;
    this.viewReview();
  }

  reset() {
    this.page = 0;
    this.keyWord = '';
    this.limit = 20;
    this.star = '';
    this.viewReview();
  }

  hidden() {
    this.isShowDialogDetail = false;
    this.review = null;
  }

  closeBigImage() {
    this.selectedImage = '';
    this.max = 0;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  preImage(event: Event) {
    event.stopPropagation();
    if (this.imageIndex <= 0) {
      this.imageIndex = this.max - 1;
    } else {
      this.imageIndex--;
    }
    this.updateImageSrc();
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.imageIndex >= this.max - 1) {
      this.imageIndex = 0
    } else {
      this.imageIndex++;
    }
    this.updateImageSrc();
  }

  updateImageSrc() {
    const selectedImage = this.review?.images![this.imageIndex];
    if (selectedImage) {
      this.selectedImage = selectedImage;
    }
  }

  zoomImage(reviewIndex: number, imageIndex: number, max: number) {
    this.max = max;
    this.reviewIndex = reviewIndex;
    this.imageIndex = imageIndex;
    this.updateImageSrc();
  }
}
