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
import generate_order_code from '../../apis/generate_order_code';

export default function Prepare_order(){

    const navigate = useNavigate();

    const [hand_gate, set_hand_gate] = useState<boolean>(false);
    const [zasilkovna_gate, set_zasilkovna_gate] = useState<boolean>(false);

    const [zasilkovna_gate_jo, set_zasilkovna_gate_jo] = useState<boolean>(false);

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [adress, setAdress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [PSC, setPSC] = useState<string>("");

    const [country, set_country] = useState<string>("cz");
    const [delivery_price, set_delivery_price] = useState<number>(3);

    const [products_price, set_products_price] = useState<number>(0);

    const [error_msg, set_error_msg] = useState<string>("");    
    
    const [loading, set_loading] = useState<boolean>(true);    

    const [delivery_data, set_delivery_data] = useState<Array<UserData>>([]);    

    const [session_cart_data, set_session_cart_data] = useState<Array<any>>(sessionStorage.getItem("cart_data") === null ? [] : JSON.parse(sessionStorage.getItem("cart_data")!))

    const [cookies] = useCookies(['user_data'])

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [update, set_update] = useState<boolean>(false);

    const [terms_of_servise_status, set_terms_of_servise_status] = useState<boolean>(false);


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

        if(!name){set_error_msg("Name is missing")}
        if(!surname){set_error_msg("Surname is missing")}
        if(!email){set_error_msg("Email is missing")}
        if(!telephone){set_error_msg("Phone number is missing")}
        if(!adress){set_error_msg("Adress is missing")}
        if(!city){set_error_msg("City is missing")}
        if(!PSC){set_error_msg("PSČ is missing")}
        if(session_cart_data.length < 1){set_error_msg("Must put items in cart")}

        if(terms_of_servise_status === false){set_error_msg("You must agree with terms of service to proceed")}

       
        if(name && surname && email && telephone && adress && city && PSC && session_cart_data.length > 0 && terms_of_servise_status){

            var cart_data = get_cart_data(session_cart_data)

            var validation_responce: any = await cart_products_validation(cart_data.templates_for_validation)

            var order_code = (await generate_order_code()).order_code

            if(validation_responce.next_status === true){
                var order_template;

                if(delivery_data.length <= 0){
                    order_template = get_order_template(null, name, surname, email, adress, telephone, PSC, cart_data.ids, cart_data.sizes, cart_data.amounts, cart_data.prizes, "Inactive", country, zasilkovna_gate, order_code)
                }else{
                    order_template = get_order_template(delivery_data[0].users[0].id, name, surname, email, adress, telephone, PSC, cart_data.ids, cart_data.sizes, cart_data.amounts, cart_data.prizes, cookies.user_data[0].login_status, country, zasilkovna_gate, order_code)
                }
    
                var responce = await get_stripe_payment_url(cart_data, order_template, delivery_price, order_code)
    
                if(responce.url){
                    window.location = responce.url
                    sessionStorage.setItem("cart_data", JSON.stringify([]))
                }
            }else{
                sessionStorage.setItem("cart_data", JSON.stringify([]))
                navigate("/main", {state:{msg: "error: invalid manipulation with data"}});
            }
        }

        set_loading(false)
    }

    var handle_click_user = (pointer: number) => {
        if(delivery_data){
            var user_info: User_data = delivery_data[0].user_data[pointer]
        
            setName(user_info.name)
            setSurname(user_info.surname)
            setEmail(user_info.email)
            setTelephone(user_info.phone)
            
        }
    }

    var handle_click_delivery = (pointer: number) => {
        if(delivery_data){
            var user_info: User_data = delivery_data[0].user_data[pointer]
        
           
            setAdress(user_info.adress)
            setCity(user_info.city)
            setPSC(user_info.postcode)
        }
    }

    var zasilkovna_mapa_handle = () => {
        const script = document.createElement('script');
        script.src = 'https://widget.packeta.com/v6/www/js/library.js';
        script.async = true;

        const packetaApiKey = 'e49432e5e4e5c7bf';

        const packetaOptions = {
            country: "cz,sk", 
  valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street", 
  view: "modal", 
  defaultCurrency: "kč"
        };

        var new_window: any = window

        script.onload = () => {

            new_window.Packeta.Widget.pick(packetaApiKey, (point: any) => {console.log(point);if(point !== null) {setAdress(point.street); setCity(point.city); setPSC(point.zip); hadle_country_hange(point.country); set_zasilkovna_gate_jo(true)}}, packetaOptions)
        
        };

        script.onerror = () => {
            console.error('Chyba při načítání Packeta widget skriptu.');
          };

          document.body.appendChild(script);

          return () => {
            const scriptElement = document.querySelector('script[src="https://widget.packeta.com/v6/www/js/library.js"]');
            if (scriptElement) {
              document.body.removeChild(scriptElement);
            }
          };
    }

    var hadle_country_hange = (country: string) => {

        if(country === "sk"){
            if(hand_gate){
                set_delivery_price(5)
            }
            if(zasilkovna_gate){
                set_delivery_price(4)
            }
        }


        if(country === "cz"){
            if(hand_gate){
                set_delivery_price(4)
            }
            if(zasilkovna_gate){
                set_delivery_price(3)
            }
        }
        
        set_country(country)
    }
        
    useEffect(() => {

        if(sessionStorage.getItem("cart_data") === null){
            set_session_cart_data([])
        }else{
            set_session_cart_data(JSON.parse(sessionStorage.getItem("cart_data")!))
        }

    }, [update])

    return(
        <>

            {loading ? <Loading></Loading> : <>
                <Cart_items update={set_update} updata_status={update} price_change={set_products_price}></Cart_items>
                <br />
    
                {session_cart_data.length > 0 ? <>
                    <Money_sum delivery={delivery_price} delivery_price_change={set_delivery_price} items={products_price} items_price_change={set_products_price}></Money_sum>

                <p>{error_msg}</p>

                {delivery_data.length > 0 && user_data.length > 0 ? user_data[0].login_status === "Active" && delivery_data[0].user_data.length > 0 ?
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>

                            <tbody>
                
                    {delivery_data[0].user_data.map((delivery_info: User_data, index: number) => 
                            <tr key={index.toString()} onClick={() => {handle_click_user(index)}}>
                                <td>{delivery_info.name}</td>
                                <td>{delivery_info.surname}</td>
                                <td>{delivery_info.email}</td>
                                <td>{delivery_info.phone}</td>
                            </tr>
                    )}
                            </tbody> 
                        </table>
                    </>: <>
                    <p>No customer delivery informations</p>
                    <Link to={"/add-delivery-info"}>Add delivery informations</Link>
                    <br />
                    
                    </>
                : ""}

                <br />

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

                        
                        <p>Select delivery</p>                       

                        <button onClick={(e) => {e.preventDefault(); set_hand_gate(!hand_gate); setAdress(""); setCity(""); setPSC(""); set_zasilkovna_gate_jo(false); set_zasilkovna_gate(false)}}>Delivery to adress</button>

                        <br />

                    {hand_gate ? <>

                        {delivery_data.length > 0 && user_data.length > 0 && user_data[0].login_status === "Active" && delivery_data[0].user_data.length > 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Adress</th>
                                    <th>City</th>
                                    <th>PSČ</th>
                                </tr>
                            </thead>

                            <tbody>     
                    
                    {delivery_data.length > 0 ? delivery_data[0].user_data.map((delivery_info: User_data, index: number) => 
                            <tr key={index.toString()} onClick={() => {handle_click_delivery(index)}}>
                                
                                <td>{delivery_info.adress}</td>
                                <td>{delivery_info.city}</td>
                                <td>{delivery_info.postcode}</td>
                            </tr>
                    ): <></>}
                            </tbody> 
                        </table> : <></>}

                        <br />

                        <label htmlFor="country">{"Country"}</label>
                        <select id='country' onChange={(event) => hadle_country_hange(event.target.value)}>
                            <option value="cz">Czech republic</option>
                            <option value="sk">Slovakia</option>        
                        </select>   

                        <br />

                        <label htmlFor="adress">{"Adress"}</label>
                        <input id="adress" type="text" value={adress} onChange={(e) => setAdress(e.target.value)}></input>
                        <br></br>

                        <label htmlFor="city">{"City"}</label>
                        <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)}></input>
                        <br></br>

                        <label htmlFor="PSC">{"PSČ"}</label>
                        <input id="PSC" type="text" value={PSC} onChange={(e) => setPSC(e.target.value)}></input>
                        <br></br>
                    </> : <></>}

                    <br />

                    <button onClick={(e) => {e.preventDefault(); set_zasilkovna_gate(!zasilkovna_gate); setAdress(""); setCity(""); setPSC(""); set_hand_gate(false); set_zasilkovna_gate_jo(false)}}>Use packeta delivery points</button>

                    <br />

                    <br /> 

                    {zasilkovna_gate ? 
                    <>
                        <button onClick={(e) => {e.preventDefault(); zasilkovna_mapa_handle()}}>Choose delivery point</button>

                        {zasilkovna_gate_jo ? <>

                            <br />

                            {country === "sk" ? <><p id="country">{"Country: Slovakia"}</p></> : <p id="country">{"Country: Czech republic"}</p>}

                            <p id="adress">{"Adress: " + adress}</p>

                            <p id="city">{"City: " + city}</p>

                            <p id="PSC">{"PSČ: " + PSC}</p>


                        </> : <>
                            <p>Delivery point not selected</p>
                        </>}

                        
                    </>
                    : <></>} 

                    <br />

                    <br />

                    <label htmlFor="terms_of_servise_status">Do you agree with the terms of service? <Link to={"/term-or-servise"}>See terms of service</Link></label>
                    <input id='terms_of_servise_status' type="checkbox" onChange={() => set_terms_of_servise_status(!terms_of_servise_status)}/>

                    <button>Proceed to payment</button>

                    </form>                

                </div>
                </> : <></>}

                


            </>}
            
        </>
    )
}

