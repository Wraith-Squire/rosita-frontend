export type TallyStatus = `${'draft'|'completed'}`;

export interface BaseTally {
    date_tallied?: Date,
    comment?: string,
    status?: TallyStatus,
    products?: Array<Record<string, any>>,
    total_count?: number,
    total_sold?: number,
    total_unsold?: number,
    total_cost?: number,
    total_sales?: number,
    total_income?: number,
}

export interface Tally extends BaseTally {
    tally_id?: number
}