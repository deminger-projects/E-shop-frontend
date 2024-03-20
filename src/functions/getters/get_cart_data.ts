import Cart from "../../interfaces/Cart"

export default function get_cart_data(cokkie_cart_data: Array<Cart>){
  
  const cart_data: Array<Cart> = cokkie_cart_data

  var ids: Array<number> = []
  var sizes: Array<string> = []
  var amounts: Array<number> = []
  var prices: Array<number> = []
  var payment_items: Array<{name:string, prize: number, amount: number}> = []
  var items_for_validation = []

  for(var product of cart_data){

    ids.push(product.product.products[0].id)
    prices.push(product.product.products[0].price)
    sizes.push(product.size_data.size)
    amounts.push(product.size_data.current_amount)  
    payment_items.push({name: product.product.products[0].product_name, prize: product.product.products[0].price, amount: product.size_data.current_amount})
    items_for_validation.push({name: product.product.products[0].product_name, prize: product.product.products[0].price, id: product.product.products[0].id})
  }

  return {ids: ids, prizes: prices, amounts: amounts, sizes: sizes, cart_products: cart_data, cart_items_for_stripe_paywall: payment_items, items_for_validation: items_for_validation}
}