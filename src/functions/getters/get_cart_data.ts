import Cart from "../../interfaces/Cart"

export default function get_cart_data(cokkie_cart_data: Array<any>){
  
  const cart_data: Array<Cart> = cokkie_cart_data

  var ids: Array<number> = []
  var sizes: Array<string> = []
  var amounts: Array<number> = []
  var prices: Array<number> = []
  var payment_items: Array<{name:string, prize: number, amount: number}> = []
  var items_for_validation = []

  var validaton = []

  for(var product of cart_data){

    var my_product: any = product.product

    validaton.push({id: my_product[0].id, name: my_product[0].product_name, discount: my_product[0].discount, price: my_product[0].price, description: my_product[0].description})

    ids.push(my_product[0].id)
    prices.push(my_product[0].price)
    sizes.push(product.size_data.size)
    amounts.push(product.size_data.current_amount)  
    payment_items.push({name: my_product[0].product_name, prize: my_product[0].price, amount: product.size_data.current_amount})
    items_for_validation.push({name: my_product[0].product_name, prize: my_product[0].price, id: my_product[0].id})
  }

  return {ids: ids, prizes: prices, amounts: amounts, sizes: sizes, cart_products: cart_data, cart_items_for_stripe_paywall: payment_items, items_for_validation: items_for_validation, templates_for_validation: validaton}
}