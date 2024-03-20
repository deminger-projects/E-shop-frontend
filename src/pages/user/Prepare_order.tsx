import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  

import get_cart_data from '../../functions/getters/get_cart_data';

import Cart_items from '../../components/Cart_items';

import UserData, {User_data} from "../../interfaces/user/User_data"

import get_order_template from '../../templates/order/get_order_template';
import Money_sum from '../../components/Money_sum';
import { useCookies } from 'react-cookie';

export default function Prepare_order(){

    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [adress, setAdress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [PSC, setPSC] = useState<string>("");

    const [error_msg, set_error_msg] = useState<string>("");    
    
    const [loading, set_loading] = useState<boolean>(false);    

    const [delivery_data, set_delivery_data] = useState<Array<UserData>>([]);    

    const [cookies, setCookie] = useCookies(['user_data', 'cart_data', 'user_account_data'])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {

            const email = cookies.user_data[0].email
            const password = cookies.user_data[0].password

            const form_data = new FormData()

            form_data.append("email", JSON.stringify(email))
            form_data.append("password", JSON.stringify(password))

          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_user_acccount_data', {
            method: 'POST',
            body: form_data
        });             


          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_delivery_data(data)
          set_loading(false);

        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };
      
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
        if(cookies.cart_data.length === 0){set_error_msg("must put items in cart")}
       
        if(name && surname && email && telephone && adress && city && PSC && cookies.cart_data.length > 0){

            var cart_data = get_cart_data(cookies.cart_data)

            try{

                const order_template = get_order_template(delivery_data[0].users[0].id, name, surname, email, adress, telephone, PSC, cart_data.ids, cart_data.sizes, cart_data.amounts, cart_data.prizes, cookies.user_data[0].login_status)

                const form_data = new FormData()

                form_data.append('items', JSON.stringify({products: cart_data.cart_items_for_stripe_paywall}))
                form_data.append('tables', JSON.stringify(order_template))
                form_data.append('cart', JSON.stringify(cart_data.items_for_validation))

                const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/stripe_create_session', {
                    method: 'POST',
                    body: form_data
                })

                const data = await responce.json()

                if(data.url){
                    window.location = data.url
                }
                        
            } catch (err){
                console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            }
        }

        set_loading(false)
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

            {loading ? <p>loading</p> : <>
                <Cart_items></Cart_items>

                <Money_sum></Money_sum>

                <p>{error_msg}</p>

                {delivery_data.length > 0 && cookies.user_data ? cookies.user_data[0].login_status === "Active" && delivery_data[0].user_data.length > 0 ?
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
                        <input id="PSC" type="number" value={PSC} onChange={(e) => setPSC(e.target.value)}></input>
                        <br></br>

                        <button>send</button>

                    </form>
                </div>

                <Link to="/add-delivery-info"><button>add delivery info</button></Link>
            </>}
            
        </>
    )
}