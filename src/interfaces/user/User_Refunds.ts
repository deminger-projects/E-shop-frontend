export default interface User_refunds {
    refunds:        Refund[];
    order_products: OrderProduct[];
}

export interface OrderProduct {
    size:       string;
    amount:     number;
    prize:      number;
    image_url:  string;
    name:       string;
    product_id: number;
    id:         number;
}

export interface Refund {
    id:       number;
    order_id: number;
    name:     string;
    surname:  string;
    email:    string;
    adress:   string;
    phone:    string;
    postcode: string;
    add_date: string;
    status:   string;
    order_code: string
}
