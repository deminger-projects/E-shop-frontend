import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Cart from '../../components/Cart';
import User_size_select from '../../components/User_size_select';

import {ProductSize} from "../../interfaces/Product"

import User_show_case from '../../components/User_show_case';
import { useCookies } from 'react-cookie';

export default function Item_info(){

    const navigate = useNavigate();

    var url_data = useParams()
    var id = Number(url_data.id)

    const [data, set_data] = useState<any>()
    const [loading, set_loading] = useState<boolean>(true)

    const [response, set_responce] = useState<string>("")
    const [size_select, set_size_select] = useState<ProductSize>()

    const [error_msg, set_error_msg] = useState<string>("")

    const [cookies, set_cookies] = useCookies(['cart_data', 'user_data']);
    console.log("🚀 ~ Item_info ~ cookies:", cookies)

    var handle_cart_change = async (event: React.MouseEvent<HTMLButtonElement>, move?: boolean) => {

        set_loading(true)

        event.preventDefault();

        var clone = cookies.cart_data

        console.log("🚀 ~ varhandle_cart_change= ~ clone:", clone)
        console.log("🚀 ~ varhandle_cart_change= ~ data[0]:", data[0])
        console.log("🚀 ~ varhandle_cart_change= ~ size_select:", size_select)

        if(cookies.cart_data !== "undefined"){

            clone.push({size_data: size_select, product: data[0]})
    
            set_cookies("cart_data", clone, {path: "/"})
        }else{    
            set_cookies("cart_data", [] , {path: "/"})

            clone.push({size_data: size_select, product: data[0]})
            
            set_cookies("cart_data", clone, {path: "/"})
            
        }

        if(move){navigate("/prepare-order", {state: {data: data[0]}});}

        set_loading(false)

    }

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
    
    return(
        <>

            <p>{error_msg}</p>

            {loading ? <p>loading</p> : <>
                <Cart></Cart>

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