import { useState } from 'react';
import { Link } from 'react-router-dom';
import get_cart_data from '../functions/getters/get_cart_data';

export default function Money_sum() {
  
    const cart_data = get_cart_data()

    var products_cost = 0
    var delivery_cost = 15

    for(let item of cart_data.cart_products){
        var price = item.product.products[0].price
        var discount = Number(item.product.products[0].discount)

        if(discount !== 0){
            price = price * discount / 100
        }

        let quantiti = item.size_data.current_amount

        products_cost += quantiti * price
    }
    
    
  return (
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
  );
}