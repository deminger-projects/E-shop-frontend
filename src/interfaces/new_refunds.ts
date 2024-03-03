export default interface New_orders {
    orders:         Order[];
    order_products: OrderProduct[];
}

export interface OrderProduct {
    id:         number;
    product_id: number;
    name:       string;
    size:       string;
    amount:     number;
    prize:      number;
    image_url:  string;
}

export interface Order {
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
