import Product from "./Product"

export default interface Cart{
    product: Product
    size_data: Size_data
}

interface Size_data{
    current_amount: number
    size: string
}