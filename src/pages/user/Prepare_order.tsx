import React, { useEffect, useState } from 'react';

import get_cart_data from '../../functions/getters/get_cart_data';

import Cart_items from '../../components/Cart_items';

import UserData, {User_data} from "../../interfaces/user/User_data"

import get_order_template from '../../templates/order/get_order_template';
import Money_sum from '../../components/Money_sum';
import { useCookies } from 'react-cookie';
import get_user_acccount_data from '../../apis/getters/user/get_user_account_data';
import get_stripe_payment_url from '../../apis/getters/get_stripe_payment_url';
import Loading from '../../components/Loading';
import cart_products_validation from '../../apis/other/cart_products_validation';
import { Link, Navigate, useNavigate } from 'react-router-dom';


export default function Prepare_order(){

    const navigate = useNavigate();

    const [html_state, set_html_state] = useState<string>("");

    useEffect(() => {
        console.log(html_state)
    }, [html_state])

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [adress, setAdress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [PSC, setPSC] = useState<string>("");

    const [error_msg, set_error_msg] = useState<string>("");    
    
    const [loading, set_loading] = useState<boolean>(true);    

    const [delivery_data, set_delivery_data] = useState<Array<UserData>>([]);    

    const [session_cart_data] = useState<Array<any>>(sessionStorage.getItem("cart_data") === null ? [] : JSON.parse(sessionStorage.getItem("cart_data")!))

    const [cookies] = useCookies(['user_data'])

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

      useEffect(() => {
        const fetchData = async () => {
            if(user_data.length > 0){
                var data = await get_user_acccount_data(user_data[0].email, user_data[0].password)

                set_delivery_data(data)
                
            }
            set_loading(false);
          };

        fetchData()
    }, [])
      
    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();

        if(!name){set_error_msg("name is empty")}
        if(!surname){set_error_msg("surname is empty")}
        if(!email){set_error_msg("email is empty")}
        if(!telephone){set_error_msg("telephone is empty")}
        if(!adress){set_error_msg("adress is empty")}
        if(!city){set_error_msg("city is empty")}
        if(!PSC){set_error_msg("PSC is empty")}
        if(session_cart_data.length < 1){set_error_msg("must put items in cart")}
       
        if(name && surname && email && telephone && adress && city && PSC && session_cart_data.length > 0){

            var cart_data = get_cart_data(session_cart_data)

            var validation_responce: any = await cart_products_validation(cart_data.templates_for_validation)

            if(validation_responce.next_status === true){
                var order_template;

                if(delivery_data.length <= 0){
                    order_template = get_order_template(null, name, surname, email, adress, telephone, PSC, cart_data.ids, cart_data.sizes, cart_data.amounts, cart_data.prizes, "Inactive")
                }else{
                    order_template = get_order_template(delivery_data[0].users[0].id, name, surname, email, adress, telephone, PSC, cart_data.ids, cart_data.sizes, cart_data.amounts, cart_data.prizes, cookies.user_data[0].login_status)
                }
    
                var responce = await get_stripe_payment_url(cart_data, order_template)
    
                if(responce.url){
                    window.location = responce.url
                    sessionStorage.setItem("cart_data", JSON.stringify([]))
                }
            }else{
                sessionStorage.setItem("cart_data", JSON.stringify([]))
                navigate("/main", {state:{msg: "error: invalid manipulation with data"}});
            }
        }

        //set_loading(false)
    }

    var handle_click = (pointer: number) => {
        if(delivery_data){
            var user_info: User_data = delivery_data[0].user_data[pointer]
        
            setName(user_info.name)
            setSurname(user_info.surname)
            setEmail(user_info.email)
            setTelephone(user_info.phone)
            setAdress(user_info.adress)
            setCity(user_info.city)
            setPSC(user_info.postcode)
        }
    }
   

    return(
        <>

            {loading ? <Loading></Loading> : <>
                <Cart_items></Cart_items>
                <br />
    
                <Money_sum></Money_sum>

                <p>{error_msg}</p>

                {delivery_data.length > 0 && user_data.length > 0 ? user_data[0].login_status === "Active" && delivery_data[0].user_data.length > 0 ?
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
                
                    {delivery_data[0].user_data.map((delivery_info: User_data, index: number) => 
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
                    </>: <p>no delivery info</p>
                : ""}

                    

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
                        <input id="PSC" type="text" value={PSC} onChange={(e) => setPSC(e.target.value)}></input>
                        <br></br>

                        <button>send</button>

                    </form>                
                    
                

                </div>
            </>}
            
        </>
    )
}

