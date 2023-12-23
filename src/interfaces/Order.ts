export default interface Order {
    orders:         OrderUser[];
    order_products: OrderProduct[];
}

export interface OrderProduct {
    id:            number;
    product_id:    number;
    size:          string;
    amount:        number;
    name:          string;
    price:         number;
    discount:      number;
    collection_id: number | null;
    description:   string;
}

export interface OrderUser {
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