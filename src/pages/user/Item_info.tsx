import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Cart from '../../components/Cart';
import User_size_select from '../../components/User_size_select';

import {ProductSize} from "../../interfaces/Product"

import User_show_case from '../../components/User_show_case';

export default function Item_info(){

    const navigate = useNavigate();

    var url_data = useParams()
    const id = Number(url_data.id)

    const [data, set_data] = useState<any>()
    const [loading, set_loading] = useState<boolean>(true)

    const [response, set_responce] = useState<string>("")
    const [size_select, set_size_select] = useState<ProductSize>()

    const [error_msg, set_error_msg] = useState<string>("")

    const [cart_item_count, set_cart_item_count] = useState<number>(0)

    useEffect(() => {
        var cart_session_data = sessionStorage.getItem("cart_data")

        if(cart_session_data){
            var cart = JSON.parse(cart_session_data)
            set_cart_item_count(cart.length)
        }
       
    }, [])


    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {

            const form = new FormData();

            form.append("id", JSON.stringify(id))

          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_product_by_id', {
            method: 'POST',
            body: form  
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();

           set_data(data);
           set_loading(false);

        } catch (error) {

          console.log(error);

           set_loading(false);
        }
      };
    

    var handle_cart_change = async (event: React.MouseEvent<HTMLButtonElement>, move?: boolean) => {

        set_loading(true)

        event.preventDefault();

        if(data){
            if(sessionStorage.getItem("cart_data") === null){
                sessionStorage.setItem("cart_data", JSON.stringify([]))
            }else{
                var cart_session_data = sessionStorage.getItem("cart_data")
    
                if(cart_session_data){
                    var cart = JSON.parse(cart_session_data)
    
                    cart.push({size_data: size_select, product: data[0].products})

                    set_cart_item_count(cart.length )
    
                    sessionStorage.setItem("cart_data", JSON.stringify(cart))
                }
            }
        }

        if(move){navigate("/prepare-order", {state: {data: data[0]}});}

        set_loading(false)

    }
    
    return(
        <>

            <p>{error_msg}</p>

            {loading ? <p>loading</p> : <>
                <Cart cart_item_count={cart_item_count}></Cart>

                <User_show_case images={data[0].product_images} id={data[0].products[0].id} folder={"products"}></User_show_case>

                <p id='description'>{data[0].products[0].description}</p>
                
                <div id='buy_hud'>
                    <p>{"name: " +  data[0].products[0].product_name}</p>
                    <p>{"price: " + data[0].products[0].price}</p>

                    <p>{response}</p>

                    <User_size_select sizes={data[0].product_sizes} on_change={set_size_select}></User_size_select>
            
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
            </>}
            
        </>
    )
}