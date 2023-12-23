export default interface Product {
    products:       ProductData[];
    product_sizes:  ProductSize[];
    product_images: ProductImage[];
}

export interface ProductData {
    id:              number;
    product_name:    string;
    price:           number;
    discount:        number;
    description:     string;
    url:             string;
    collection_id:   number | null;
    collection_name: string | null;
}

export interface ProductSize {
    size:           string;
    current_amount: number;
}

export interface ProductImage {
    image_url: string;
}