import { Component, HostListener, inject, OnInit } from '@angular/core';
import { finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { ProductService } from '../../../shared/services/ProductService/product.service';
import { CategoryService } from '../../../shared/services/CategoryService/category.service';
import { BrandService } from '../../../shared/services/BrandServive/brand.service';
import { Category } from '../../../models/Category.model';
import { Brand } from '../../../models/Brand.model';
import { Product } from '../../../models/Product.model';
import { ColorService } from '../../../shared/services/ColorServive/color.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from '../../../models/Message.model';
import { ImageService } from '../../../shared/services/ImageService/image.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ExcelService } from '../../../shared/services/ExcelServive/excel.service';

@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  spinner = inject(NgxSpinnerService);
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorSerive: ColorService,
    private toastr: ToastrService,
    private imageService: ImageService,
    private excelService: ExcelService
  ) { }

  page: number = 0;
  price: number = 0;
  limit: number = 20;
  endRecord: number = 0;
  startRecord: number = 1;
  totalElement: number = 0;

  star: string = '';
  title: string = '';
  maxDay: string = '';
  search: string = '';
  brandId: string = '';
  orderBy: string = '';
  endDay: string = '';
  newColor: string = '';
  startDay: string = '';
  categoryId: string = '';
  productName: string | null = '';
  selectedProductId: string | null = '';

  brands: Brand[] = [];
  colors: string[] = [];
  mainImage: File[] = [];
  products: Product[] = [];
  oldImageUrls: string[] = [];
  newImageUrls: string[] = [];
  categories: Category[] = [];
  selectedImages: File[] = [];
  currentImageFiles: File[] = [];
  currentImageUrls: string[] = [];
  selectedImageUrls: string[] = [];
  orderByList: string[] = ['', 'priceDiscountAsc', 'priceDiscountDesc', 'priceAsc', 'priceDesc'];

  isUpdate: boolean = false;
  isCreate: boolean = false;
  isCanActive: boolean = true;
  isAddNewColor: boolean = false;
  isShowDialogDelete: boolean = false;
  isRedirectEditPage: boolean = false;

  newColors: Set<string> = new Set();
  product: Product | null = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '200px',
    maxHeight: '500px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Nhập nội dung...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo']
    ]
  };

  ngOnInit(): void {
    this.initDate();
    this.initData();
    this.getAllProducts();
  }

  initDate(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const date = `${year}-${month}-${day}`;

    this.maxDay = date;
    this.endDay = date;
    this.startDay = `${year}-01-01`;
  }

  initData() {
    forkJoin({
      categories: this.categoryService.getAllCategories(),
      brands: this.brandService.getAllBrands(),
      colors: this.colorSerive.viewColors()
    }).subscribe({
      next: ({ categories, brands, colors }) => {
        this.categories = categories.data.items || [];
        this.brands = brands.data.items || [];
        this.colors = colors.data || [];
      },
      error: (err) => {
        console.error('Lỗi trong khi gọi API:', err);
      }
    });
  }

  searchProducts() {
    if (!this.search.trim()) return;
    this.page = 0;
    this.getAllProducts();
  }

  getAllProducts() {
    const recordStartIndex = this.page * this.limit + 1;
    if (recordStartIndex >= this.totalElement && this.totalElement !== 0) {
      this.page = 0;
    }

    this.productService.getProductsByConditions(this.search, this.page, this.limit, this.categoryId, this.brandId, this.orderBy, this.startDay, this.endDay, this.star).subscribe({
      next: (res => {
        if (res && res.data && res.data.items) {
          this.products = res.data.items as Product[];
          this.totalElement = res.data.pageInfo?.totalElements || 0;
          this.startRecord = recordStartIndex > this.totalElement ? 1 : recordStartIndex;
          this.endRecord = Math.min(this.limit * (this.page + 1), this.totalElement);
        }
      })
    })
  }

  prePage() {
    this.page--;
    this.getAllProducts();
  }

  nextPage() {
    this.page++;
    this.getAllProducts();
  }

  reset() {
    this.brandId = this.categoryId = this.search = this.title = this.orderBy = '';
    this.product = null;
    this.selectedImages = [];
    this.selectedImageUrls = [];
    this.isUpdate = this.isCreate = false;
    this.initDate();
    this.getAllProducts();
  }

  redirectEditPage(product: Product | null, action: number) {
    if (action === 1) {
      this.isUpdate = true;
      this.title = 'Cập nhật sản phẩm';

      if (product !== null) {
        this.getProductDetailsByProductId(product.id!);
      }
    } else if (action === 2) {
      this.isCreate = true;
      this.title = 'Tạo sản phẩm mới';
      this.product = this.generateProduct();
    } else if (action === 0) {
      this.reset();
    }

    if (action !== 1) {
      this.isRedirectEditPage = !this.isRedirectEditPage;
    }
  }

  getProductDetailsByProductId(id: string) {
    this.productService.getProductDetailsByProductId(id).subscribe({
      next: (res => {
        if (res) {
          this.product = res.data as Product;
          this.selectedImageUrls = this.product.images as string[];
          this.newColors = new Set(this.product.colors)
          this.categoryId = this.product.category as string;
          this.brandId = this.product.brand as string;
        }
      }),
      complete: () => {
        this.isRedirectEditPage = true;
        this.oldImageUrls = [...this.extractImageUrls(this.product?.description! || '')];
        this.getCurrentImageInContent();
      }
    })
  }

  generateProduct(): Product {
    return {
      sku: '',
      name: '',
      stock: 0,
      category: '',
      brand: '',
      warranty: 0,
      description: '',
      price: 0,
      discount: 0,
      discountPrice: 0,
      mainImageUrl: '',
      colors: [],
      images: []
    };
  }

  updateDiscountPrice() {
    if (this.product) {
      const { price, discount } = this.product;
      this.product.discountPrice = price! - (price! / 100 * discount!);
    }
  }

  checkDiscountPriceAndPrice() {
    if (!this.product) return;

    const product = this.product;
    product.price = Math.max(product.price || 0, 0);
    product.discount = Math.min(Math.max(product.discount || 0, 0), 100);
    this.updateDiscountPrice();
  }

  checkStock() {
    if (!this.product) return;

    const product = this.product;
    product.stock = Math.max(product.stock || 0, 0);
  }

  checkWarranty() {
    if (!this.product) return;

    const product = this.product;
    product.warranty = Math.max(product.warranty || 0, 0);
  }

  toggleInputNewColor() {
    this.isAddNewColor = !this.isAddNewColor;
  }

  createNewColors(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    const exists = this.colors.some(c => c.toLowerCase() === value.toLowerCase());

    if (!exists) {
      this.colors.push(value);
      this.toastr.success(Message.SUCCESS_ADD_NEW_COLOR);
    } else {
      this.toastr.error(Message.EXIST_COLOR);
    }
  }

  addNewColors(event: any, color: string) {
    event.target.checked ? this.newColors.add(color) : this.newColors.delete(color);
  }

  onFilesSelected(event: Event): void {
    const files = this.imageService.onFilesSelected(event);
    this.selectedImages.push(...files);
    this.selectedImageUrls = files.map((file: Blob | MediaSource) => URL.createObjectURL(file));
  }

  insertImageToContent(event: Event) {
    const files = this.imageService.onFilesSelected(event);
    this.currentImageFiles.push(...files);
    this.currentImageUrls = files.map((file: Blob | MediaSource) => URL.createObjectURL(file));

    if (this.product) {
      this.currentImageUrls.forEach(url => {
        this.product!.description += `<img src="${url}" style="max-width: 100%;">`;
      });
    }
  }

  onFilesSelectedForMainImage(event: Event): void {
    const files = this.imageService.onFilesSelected(event);
    this.mainImage.push(...files);

    if (this.product) {
      this.product.mainImageUrl = URL.createObjectURL(files[0]);
    }
  }

  updateProduct(): void {
    if (!this.product) return;

    this.isCanActive = false;
    this.product.colors = Array.from(this.newColors);

    const uploadImages = (files: File[]) => files?.length ? this.imageService.uploadMultipleFiles(files) : of([]);

    forkJoin([
      uploadImages(this.currentImageFiles),
      uploadImages(this.selectedImages)
    ])
      .pipe(
        tap(([contentUrls, galleryUrls]) => {
          if (contentUrls.length > 0) {
            this.convertImageInContent(contentUrls);
          }
          if (galleryUrls.length > 0) {
            this.product!.images = galleryUrls;
          }
        }),
        switchMap(() => this.imageService.deleteImages(this.oldImageUrls.filter(item => !this.currentImageUrls.includes(item)))),
        switchMap(() => this.productService.updateProduct(this.product!)),
        finalize(() => {
          this.oldImageUrls = [];
          this.newImageUrls = [];
          this.selectedImages = [];
          this.currentImageUrls = [];
          this.currentImageFiles = [];
          this.isCanActive = true;
          this.isRedirectEditPage = false;
        }))
      .subscribe({
        next: (res: any) => {
          if (res?.message) {
            this.toastr.success(res.message);
          }
        },
        error: (err) => this.toastr.error(err)
      });
  }

  private convertImageInContent(urls: string[]) {
    const doc = new DOMParser().parseFromString(this.product?.description!, 'text/html');
    doc.querySelectorAll('img').forEach((img, i) => {
      if (img.src.startsWith('blob:') && urls[i]) {
        img.src = urls[i];
      }
    });
    this.product!.description = doc.body.innerHTML;
  }

  showDialogDelete(id: string | null, name: string | null) {
    this.selectedProductId = id;
    this.productName = name;
    this.isShowDialogDelete = !this.isShowDialogDelete;
  }

  deleteProduct() {
    if (!this.selectedProductId) return;

    this.productService.deleteProduct(this.selectedProductId).subscribe({
      next: (res => {
        if (res?.status === 'success') {
          this.toastr.success(Message.SUCCESS_DELETED_PRODUCT);
          this.products = this.products.filter(p => p.id !== this.selectedProductId);
          this.selectedProductId = this.productName = '';
          this.isShowDialogDelete = false;
        }
      })
    })
  }

  addProduct() {
    if (!this.product?.sku) {
      this.toastr.error(Message.MISSING_SKU_WHEN_CREATE);
      return;
    }

    if (!this.product?.name) {
      this.toastr.error(Message.MISSING_PRODUCT_NAME_WHEN_CREATE);
      return;
    }

    if (!this.categoryId) {
      this.toastr.error(Message.MISSING_CATEGORY_NAME_WHEN_CREATE);
      return;
    }

    if (!this.brandId) {
      this.toastr.error(Message.MISSING_BRAND_NAME_WHEN_CREATE);
      return;
    }

    if (!this.newColors) {
      this.toastr.error(Message.MISSING_COLORS_WHEN_CREATE);
      return;
    }

    if (this.selectedImages.length === 0) {
      this.toastr.error(Message.MISSING_IMAGES_WHEN_CREATE);
      return;
    }

    if (!this.product.mainImageUrl) {
      this.toastr.error(Message.MISSING_MAIN_IMAGE_WHEN_CREATE);
      return;
    }

    this.isCanActive = false;
    forkJoin({
      images: this.imageService.uploadMultipleFiles(this.selectedImages),
      image: this.imageService.uploadMultipleFiles(this.mainImage),
      imagesContent: this.imageService.uploadMultipleFiles(this.currentImageFiles)
    }).subscribe({
      next: ({ images, image, imagesContent }) => {
        this.product!.images = images;
        this.product!.mainImageUrl = image[0];

        if (imagesContent.length > 0) {
          this.convertImageInContent(imagesContent);
        }

        if (this.newColors) {
          this.product!.colors = Array.from(this.newColors);
        }
        this.product!.category = this.categoryId;
        this.product!.brand = this.brandId;

        this.productService.addProduct(this.product!).subscribe({
          next: (res => {
            if (res?.status === 'success') {
              this.toastr.success(res.message);
            }
          }),
          error: () => this.isCanActive = true,
          complete: () => {
            this.reset();
            this.isCanActive = true;
            this.isRedirectEditPage = false;
          }
        })
      },
      error: (err) => {
        this.toastr.error(err);
        this.isCanActive = true;
      }
    });
  }

  deleteImage(index: number) {
    this.selectedImageUrls.splice(index, 1);
  }

  changeOrderBy(index: number) {
    this.orderBy = this.orderByList[index];
    this.getAllProducts();
  }

  private extractImageUrls(htmlContent: string): string[] {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const imgElements = div.querySelectorAll('img');
    return Array.from(imgElements).map(img => img.src);
  }

  getCurrentImageInContent() {
    this.currentImageUrls = this.extractImageUrls(this.product?.description! || '');
  }

  exportExcel() {
    this.excelService.exportProductsToExcel(this.search, this.page, this.limit, this.categoryId, this.brandId, this.orderBy).subscribe(blob => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'products.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Lỗi tải file Excel:', error);
    });
  }
}