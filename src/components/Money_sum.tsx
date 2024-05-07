import { useEffect, useState } from 'react';

export default function Money_sum() {
  
  const [cart_data] = useState<Array<any>>(sessionStorage.getItem("cart_data") === null ? [] : JSON.parse(sessionStorage.getItem("cart_data")!))

  const [products_cost, set_products_cost] = useState(0)
  const [delivery_cost] = useState(0)

  const [loading, set_loading] = useState(true)

  useEffect(() => {

    if(cart_data.length > 0){
      var sum_product_cost = 0

      for(let item of cart_data){
          var price = item.product[0].price
          var discount = Number(item.product[0].discount)
  
          if(discount !== 0){
              price = price * discount / 100
          }
  
          let quantiti = item.size_data.current_amount
  
          sum_product_cost += quantiti * price
        }
  
        set_products_cost(sum_product_cost)
    }

    set_loading(false)
    
  },[cart_data])
    
    
    
    
  return (
    <>
      {loading ? <p>loading</p> : <>
        <div>
          <table>
            <tbody>
                <tr>
                    <th>Item</th>
                    <th>Cost</th>
                    <th>Sum</th>
                </tr>

                <tr>
                    <th>Products:</th>
                    <th>Delivery:</th>
                </tr>

                <tr>
                    <td>{products_cost + "€"}</td>
                    <td>{delivery_cost + "€"}</td>
                    <td>{products_cost + delivery_cost + "€"}</td>
                </tr>
              </tbody>
          </table>
        </div>
      </>}
    </>
    
  );
}