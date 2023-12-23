export default interface Refund_Data {
    refunds:         Refund[];
    refund_products: Refund_Product[];
}

export interface Refund {
    id:       number;
    name:     string;
    surname:  string;
    email:    string;
    adress:   string;
    phone:    string;
    postcode: string;
    add_date: string;
    status:   string;
}

export interface Refund_Product {
    product_id: number
    id: number
    amount: number
    size: string
    prize: number
    name: string
    reason: string
}
