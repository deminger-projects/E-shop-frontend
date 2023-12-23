export default interface User_Refunds {
    refunds:         Refund[];
    refund_products: RefundProduct[];
}

export interface RefundProduct {
    id:     number;
    name:   string;
    amount: number;
    reason: string;
    prize:  number;
    size:   string;
}

export interface Refund {
    status: string;
    id:            number;
    name:          string;
    surname:       string;
    email:         string;
    adress:        string;
    phone:         string;
    postcode:      string;
    add_date:      string;
}
