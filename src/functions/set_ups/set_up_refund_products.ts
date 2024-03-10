import User_orders from "../../interfaces/user/User_orders"

interface Refund {
    id: number
    reason: string | undefined
    amount: string | undefined
    size: string
    status: boolean
}

export default function set_up_refund_products(products: User_orders){

    var refund_arr: Array<Refund> = [] 

    for(var product of products.order_products){
       console.log("🚀 ~ set_up_refund_products ~ product:", product)
       if(product.product_id){
        refund_arr.push({id: product.product_id, reason: undefined, amount: undefined, size: product.size, status: false})
       }else{
        refund_arr.push({id: product.id, reason: undefined, amount: undefined, size: product.size, status: false})
       }
    }

    return refund_arr

}