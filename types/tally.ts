export type TallyStatus = `${'draft'|'completed'}`;

export interface BaseTally {
    date_tallied?: Date,
    comment?: string,
    status?: TallyStatus,
    products?: Array<TallyProduct>,
    total_count?: number,
    total_sold?: number,
    total_unsold?: number,
    total_cost?: number,
    total_sales?: number,
    total_income?: number,
    created_at?: Date,
    updated_at?: Date
}

export interface Tally extends BaseTally {
    tally_id?: number
}

export interface TallyErrors {
    date_tallied?: Array<string>,
    comment?: Array<string>,
    status?: Array<string>,
    products?: Array<string>,
    total_count?: Array<string>,
    total_sold?: Array<string>,
    total_unsold?: Array<string>,
    total_cost?: Array<string>,
    total_sales?: Array<string>,
    total_income?: Array<string>,
}

export interface TallyProduct {
    product_id?: number,
    product_name?: string,
    product_count?: number,
    product_unsold?: number,
    product_sold?: number,
    product_price?: number,
    product_cost?: number,
    product_sales?: number,
    product_income?: number,
}

export interface TallyProductErrors {
    product_name?: Array<string>,
    product_count?: Array<string>,
    product_unsold?: Array<string>
}