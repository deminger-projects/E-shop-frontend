export default interface User_orders {
    refunds:        Refund[];
    order_products: OrderProduct[];
}

export interface OrderProduct {
    id:         number;
    product_id: number;
    name:       string;
    size:       string;
    amount:     number;
    prize:      number;
}

export interface Refund {
    id:            number;
    name:          string;
    surname:       string;
    email:         string;
    adress:        string;
    phone:         string;
    postcode:      string;
    add_date:      string;
    status:        string;
    refund_count: number;

}