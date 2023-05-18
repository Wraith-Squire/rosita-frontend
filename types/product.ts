export interface BaseProduct {
    product_name?: string,
    product_price?: number,
    product_cost?: number,
    created_at?: Date,
    updated_at?: Date
}

export interface Product extends BaseProduct {
    product_id?: number
}

export interface ProductErrors {
    product_name?: Array<string>,
    product_price?: Array<string>,
    product_cost?: Array<string>
}