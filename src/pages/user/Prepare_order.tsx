import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  

import get_cart_data from '../../functions/getters/get_cart_data';

import Cart_items from '../../components/Cart_items';

import user_data from "../../data/user_data.json"
import login_data from "../../data/login_data.json"
import cart from "../../data/cart.json"

import Tables from "../../interfaces/Tables"
import {DeliveryData} from "../../interfaces/user/User_data"

import add_record from '../../apis/add_record';
import get_stripe_payment_url from '../../apis/get_stripe_payment_url';

export default function Prepare_order(){

    console.log(process.env.REACT_APP_SECRET_SERVER_URL)

    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [adress, setAdress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [PSC, setPSC] = useState<string>("");

    const [error_msg, set_error_msg] = useState<string>();

    const [order_status, set_order_status] = useState<boolean>(false)

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!name){set_error_msg("name is empty")}
        if(!surname){set_error_msg("surname is empty")}
        if(!email){set_error_msg("email is empty")}
        if(!telephone){set_error_msg("telephone is empty")}
        if(!adress){set_error_msg("adress is empty")}
        if(!city){set_error_msg("city is empty")}
        if(!PSC){set_error_msg("PSC is empty")}
        if(cart.length === 0){set_error_msg("must put items in cart")}
       
        if(name && surname && email && telephone && adress && city && PSC && cart.length > 0){

            var cart_data = get_cart_data()

            var tables: Tables

                    if(login_data[0].users[0].login_status === "Active"){
                         tables = {
                            orders: {user_id: login_data[0].users[0].id, name: name, surname: surname, email: email, adress: adress, phone: telephone, postcode: PSC},
                            order_products: {order_id: null, product_id: cart_data.ids, size: cart_data.sizes, amount: cart_data.amounts, prize: cart_data.prizes}
                        }
                    }else{
                         tables = {
                            orders: {name: name, surname: surname, email: email, adress: adress, phone: telephone, postcode: PSC},
                            order_products: {order_id: null, product_id: cart_data.ids, size: cart_data.sizes, amount: cart_data.amounts, prize: cart_data.prizes}
                            }
                    }

            var [url, stripe_error] = await get_stripe_payment_url(cart_data.cart_items_for_stripe_paywall, tables)

            if(stripe_error){
                set_error_msg(stripe_error)
            }else{
                window.location = url.payment_url

                const [api_responcem, error] = await add_record(tables, login_data[0].users[0].id, undefined , undefined, true)       
                
                if(error){
                    set_error_msg(error.msg)
                }else{
                    navigate("/order-completed", {state: {data: cart_data.cart_products}});
                }
            }     
        }
    }

    var handle_click = (pointer: number) => {
        var user_info: DeliveryData = user_data[0].user_data[pointer]
        
        setName(user_info.name)
        setSurname(user_info.surname)
        setEmail(user_info.email)
        setTelephone(user_info.phone)
        setAdress(user_info.adress)
        setCity(user_info.city)
        setPSC(user_info.postcode)
    }
    
    return(
        <>
            <Cart_items></Cart_items>

            <p>{error_msg}</p>

            {login_data[0].users[0].login_status === "Active" && user_data[0].user_data.length > 0 ?
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>surname</th>
                                <th>phone</th>
                                <th>adress</th>
                                <th>city</th>
                                <th>psc</th>
                            </tr>
                        </thead>

                        <tbody>
            
                {user_data[0].user_data.map((delivery_info: DeliveryData, index: number) => 
                        <tr key={index.toString()} onClick={() => {handle_click(index)}}>
                            <td>{delivery_info.name}</td>
                            <td>{delivery_info.surname}</td>
                            <td>{delivery_info.phone}</td>
                            <td>{delivery_info.adress}</td>
                            <td>{delivery_info.city}</td>
                            <td>{delivery_info.postcode}</td>
                        </tr>
                )}
                        </tbody>
                    </table>
                </>
            : <></>}

                

            <div className="admin_add_product">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label htmlFor="name">{"Name"}</label>
                    <input id="name" type="text" value={surname} onChange={(e) => setSurname(e.target.value)}></input>
                    <br></br>

                    <label htmlFor="surname">{"Surname"}</label>
                    <input id="surname" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                    <br></br>

                    <label htmlFor="email">{"Email"}</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <br></br>
                    
                    <label htmlFor="telephone">{"Telephone"}</label>
                    <input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}></input>
                    <br></br>

                    <label htmlFor="adress">{"Adress"}</label>
                    <input id="adress" type="text" value={adress} onChange={(e) => setAdress(e.target.value)}></input>
                    <br></br>

                    <label htmlFor="city">{"City"}</label>
                    <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)}></input>
                    <br></br>

                    <label htmlFor="PSC">{"PSC"}</label>
                    <input id="PSC" type="number" value={PSC} onChange={(e) => setPSC(e.target.value)}></input>
                    <br></br>

                    <button>send</button>

                </form>
            </div>

            <Link to="/add-delivery-info"><button>add delivery info</button></Link>
        </>
    )
}