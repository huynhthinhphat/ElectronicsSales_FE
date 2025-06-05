export interface Review {
    id?: string;
    orderDetailId?: string;
    fullName?: string;
    avatar?: string;
    productName?: string;
    productStar?: number;
    color?: string;
    description?: string;
    star?: number;
    images?: string[]
    createdAt: Date;
    mainImage?: string
}