import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import get_cart_data from '../functions/getters/get_cart_data';
import { useCookies } from 'react-cookie';

export default function Money_sum() {
  
  const [cookies, set_cookies] = useCookies(['cart_data']);

  const [products_cost, set_products_cost] = useState(0)
  const [delivery_cost, set_delivery_cost] = useState(15)

  const [loading, set_loading] = useState(true)

  useEffect(() => {

    if(cookies.cart_data !== 'undefined'){
      var sum_product_cost = 0

      for(let item of cookies.cart_data){
          var price = item.product.products[0].price
          var discount = Number(item.product.products[0].discount)
  
          if(discount !== 0){
              price = price * discount / 100
          }
  
          let quantiti = item.size_data.current_amount
  
          sum_product_cost += quantiti * price
        }
  
        set_products_cost(sum_product_cost)
    }

    set_loading(false)
    
  },[])
    
    
    
    
  return (
    <>
      {loading ? <p>loading</p> : <>
        <div>
          <table>
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
                    <td>{products_cost}</td>
                    <td>{delivery_cost}</td>
                    <td>{products_cost + delivery_cost}</td>
                </tr>
                
          </table>
        </div>
      </>}
    </>
    
  );
}