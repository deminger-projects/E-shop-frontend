import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Cart from '../../components/Cart';
import User_size_select from '../../components/User_size_select';

import {ProductSize} from "../../interfaces/Product"

import add_to_cart from '../../apis/cart/add_to_cart';
import User_show_case from '../../components/User_show_case';

export default function Item_info(){

    const navigate = useNavigate();

    const product_data = useLocation().state.product_data;

    const [response, set_responce] = useState<string>("")
    const [size_select, set_size_select] = useState<ProductSize>()

    const [error_msg, set_error_msg] = useState<string>("")

    var handle_cart_change = async (event: React.MouseEvent<HTMLButtonElement>, move?: boolean) => {

        event.preventDefault();

        if(size_select){
            const [api_responce, error] = await add_to_cart(product_data, size_select)

            if(error){
                set_error_msg("error ocured")
            }else{
                set_responce(api_responce.msg)

                if(move){navigate("/prepare-order", {state: {data: product_data}});}
            }
        }
    }
    
    return(
        <>

            <p>{error_msg}</p>
            
            <Cart></Cart>

            <User_show_case images={product_data.product_images} id={product_data.products[0].id} folder={"products"}></User_show_case>

            <p id='description'>{product_data.products[0].description}</p>
            
            <div id='buy_hud'>
                <p>{"name: " +  product_data.products[0].product_name}</p>
                <p>{"price: " + product_data.products[0].price}</p>

                <p>{response}</p>

                <User_size_select sizes={product_data.product_sizes} on_change={set_size_select}></User_size_select>
        
                {size_select ?       
                    <>
                        <button onClick={(event) => handle_cart_change(event)}>add_to_cart</button>

                        <button onClick={(event) => handle_cart_change(event, true)}>buy</button>
                        
                    </>          
               
                : <></> }

                <p>popis produktu</p>
                <p>material</p>
                <p>prani</p>
                <p>qr kod mozna</p>
                <p>a tak</p>
                
            </div>
        </>
    )
}