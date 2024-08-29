import { useEffect, useState } from 'react';

export default function Money_sum(props: {delivery: number, delivery_price_change?: Function, items?: number, items_price_change?: Function}) {
  
  const [cart_data] = useState<Array<any>>(sessionStorage.getItem("cart_data") === null ? [] : JSON.parse(sessionStorage.getItem("cart_data")!))

  const [products_cost, set_products_cost] = useState(0)

  const [loading, set_loading] = useState(true)

  useEffect(() => {

    if(sessionStorage.getItem("cart_data") !== null){
      if(cart_data.length > 0){
        var sum_product_cost = 0
  
        for(let item of JSON.parse(sessionStorage.getItem("cart_data")!)){
            var price = item.product[0].price
            var discount = Number(item.product[0].discount)
    
            if(discount !== 0){
                price = price * discount / 100
            }
    
            let quantiti = item.size_data.current_amount
    
            sum_product_cost += quantiti * price
          }
    
          set_products_cost(sum_product_cost)
  
          if(props.items_price_change){
            props.items_price_change(sum_product_cost)
          }
      }
  
    }
    
    set_loading(false)
    
  },[cart_data, props.delivery, props.items, sessionStorage.getItem("cart_data")])
    
    
    
    
  return (
    <>
      {loading ? <p>loading</p> : <>
        <div>
          <table>
            <tbody>
                <tr>
                    <th>Items price</th>
                    <th>Delivery price</th>
                    <th>Complete price</th>
                </tr>

                <tr>
                    <td>{products_cost + " €"}</td>
                    <td>{props.delivery + " €"}</td>
                    <td>{products_cost + props.delivery + " €"}</td>
                </tr>
              </tbody>
          </table>
        </div>
      </>}
    </>
    
  );
}