import { Product } from "./Product.model";

export interface Order {
    id?: string;
    orderCode?: string;
    fromCart?: boolean;
    fullName: string;
    phoneNumber: string;
    address: string;
    totalPrice: number;
    feeDelivery: number;
    status?: string;
    paymentMethod: string;
    delivery: string;
    note: string;
    fromEstimateDate: Date;
    toEstimateDate: Date;
    totalQuantity?: number;
    items: Product[];
}