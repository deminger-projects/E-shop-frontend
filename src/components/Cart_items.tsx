import React, { useState } from "react";

import delete_from_cart from "../apis/cart/delete_from_cart";

import cart from "../data/cart.json"

import Cart from "../interfaces/Cart";

export default function Cart_items(){

    const [responce_msg, set_responce_msg] = useState<string>()
    const [error_msg, set_error_msg] = useState<string>()

    var handle_on_click = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, pozition: number) =>{

        event.preventDefault();

        const [api_responce, error] = await delete_from_cart(pozition)

        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }
    }

    return(
        <>
            <p>{responce_msg}</p>
            <p>{error_msg}</p>

            {cart.length !== 0 ? 

            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>size</th>
                        <th>image</th>
                        <th>cost</th>
                        <th>quantity</th>
                    </tr>
                </thead>
                
                <tbody >

            {cart.map((item: Cart, index: number) =>              
                    <tr key={index.toString()}>
                        <td>{item.product.products[0].product_name}</td>
                        <td>{item.size_data.size}</td>
                        <td><img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + item.product.products[0].id + "/" + item.product.products[0].url} width={"100px"} height={"100px"}></img></td>
                        <td>{item.product.products[0].price}</td>
                        <td>{item.size_data.current_amount}</td>
                        <td><button onClick={(event) =>handle_on_click(event, index)}>remove</button></td>
                    </tr>
            )}
                </tbody>

            </table>
            
            : <p>epmty cart</p> }
        </>
    )
}