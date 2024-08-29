import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Cart from '../../components/Cart';
import User_size_select from '../../components/User_size_select';

import {ProductSize} from "../../interfaces/Product"

import User_show_case from '../../components/User_show_case';
import get_product_by_id from '../../apis/getters/get_product_by_id';
import Loading from '../../components/Loading';

export default function Item_info(){

    const navigate = useNavigate();

    const url_data = useParams()
    const id = Number(url_data.id)

    const [data, set_data] = useState<any>()
    const [loading, set_loading] = useState<boolean>(true)

    const [response] = useState<string>("")
    const [size_select, set_size_select] = useState<ProductSize>()

    const [error_msg] = useState<string>("")

    const [cart_item_count, set_cart_item_count] = useState<number>(0)


    useEffect(() => {
        var cart_session_data = sessionStorage.getItem("cart_data")

        if(cart_session_data){
            var cart = JSON.parse(cart_session_data)
            set_cart_item_count(cart.length)
        }
       
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            var data = await get_product_by_id(id)
            console.log("🚀 ~ fetchData ~ data:", data)

            set_data(data);
            set_loading(false);
          };

        fetchData()
    }, [])

    var handle_cart_change = async (event: React.MouseEvent<HTMLButtonElement>, move?: boolean) => {

        set_loading(true)

        event.preventDefault();

        if(data){
            var data_insert = [{size_data: size_select, product: data[0].products}]
            if(sessionStorage.getItem("cart_data") === null || sessionStorage.getItem("cart_data") === "null"){
                set_cart_item_count(data_insert.length)
                sessionStorage.setItem("cart_data", JSON.stringify(data_insert))
            }else{
                var cart_session_data = sessionStorage.getItem("cart_data")
    
                if(cart_session_data){
                    var cart = JSON.parse(cart_session_data)
    
                    cart.push({size_data: size_select, product: data[0].products})

                    set_cart_item_count(cart.length)
    
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

            {loading ? <Loading></Loading> : <>
                <Cart cart_item_count={cart_item_count}></Cart>

                <User_show_case images={data[0].product_images} id={data[0].products[0].id} folder={"products"}></User_show_case>

                <p id='description'>{data[0].products[0].description}</p>
                
                <div id='buy_hud'>
                    
                    <p>{"Product name: " + data[0].products[0].product_name}</p>

                    <p>{"Product price: " + "€" + data[0].products[0].price}</p>

                    <p>{response}</p>

                    <User_size_select sizes={data[0].product_sizes} on_change={set_size_select}></User_size_select>
            
                    <br />

                    {size_select ?       
                        <>

                            <br />

                            <button onClick={(event) => handle_cart_change(event)}>Add to cart</button>

                            <br />

                            <br />

                            <button onClick={(event) => handle_cart_change(event, true)}>Buy</button>
                            
                        </>          
                
                    : <></> }

                    <p>Product description</p>
                    <p>Material: 100% cotton</p>
                    <p>Model product size: M</p>
                    <p>Model height: 180 cm</p>
                    
                </div>
            </>}
            
        </>
    )
}