import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Access_denied from "../Access_denied";

import login_data from "../../../data/login_data.json"

import add_record from "../../../apis/records/add_record";
import get_user_data_template from "../../../templates/user/get_user_data_template";

export default function Add_delivery_info(){

    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [adress, setAdress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [PSC, setPSC] = useState<string>("");

    const [error_msg, set_error_msg] = useState<string>("");

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!name){set_error_msg("name is empty")}
        if(!surname){set_error_msg("surname is empty")}
        if(!email){set_error_msg("email is empty")}
        if(!telephone){set_error_msg("telephone is empty")}
        if(!adress){set_error_msg("adress is empty")}
        if(!city){set_error_msg("city is empty")}
        if(!PSC){set_error_msg("postcode is empty")}

        if(name && surname && email && telephone && adress && city && PSC){

            const user_data_template = get_user_data_template(login_data[0].users[0].id, name, surname, telephone, adress, city, PSC)

            const [api_responce, error] = await add_record(user_data_template, login_data[0].users[0].id, undefined, undefined, undefined, login_data[0].users[0].login_status)
            
            if(error){
                set_error_msg("error ocured")
            }else{
                if(api_responce.next_status === true){
                    navigate('/account-info', {state: {msg: "info added"}})
                }else{
                    set_error_msg(api_responce.msg)
                }  
            }    
        }
    }

    return(
        <>
            <p>{error_msg}</p>

            {login_data[0].users[0].login_status  === "Active" ? 
                <>
                    <p>Add_delivery_info</p>

                    <div className="admin_add_product">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <label htmlFor="name">{"Name"}</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                            <br></br>

                            <label htmlFor="surname">{"Surname"}</label>
                            <input id="surname" type="text" value={surname} onChange={(e) => setSurname(e.target.value)}></input>
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

                            <button>add</button>

                        </form>
                    </div>
                </> : <Access_denied></Access_denied>
            }
        </>
    )
}