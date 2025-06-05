export interface CartItem {
    id?: string;
    cartId?: string;
    productId?: string;
    sku?: string;
    name?: string;
    color?: string;
    price?: number;
    totalPrice?: number;
    stock?: number;
    quantity?: number;
    isDeleted?: boolean;
    mainImageUrl?: string;
    colors?: string[];
}
