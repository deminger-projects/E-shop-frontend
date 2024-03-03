import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Access_denied from "../../Access_denied";

import login_data from "../../../../data/login_data.json"

import edit_record from "../../../../apis/records/edit_record";
import get_user_data_template from "../../../../templates/user/get_user_data_template";

export default function Edit_delivery_info(){

    const navigate = useNavigate();
    const user_data = useLocation().state.data;

    const [name, set_name] = useState<string>(user_data.name);
    const [surname, set_surname] = useState<string>(user_data.surname);
    const [adress, set_adress] = useState<string>(user_data.adress);
    const [city, set_city] = useState<string>(user_data.city);
    const [phone, set_phone] = useState<string>(user_data.phone);
    const [psc, set_psc] = useState<string>(user_data.postcode);

    const [error_msg, set_error_msg] = useState<string>("");

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        
        if(!name){set_error_msg("name is empty")}
        if(!surname){set_error_msg("surname is empty")}
        if(!adress){set_error_msg("adress is empty")}
        if(!city){set_error_msg("city is empty")}
        if(!phone){set_error_msg("phone is empty")}
        if(!psc){set_error_msg("postcode is empty")}

        if(name && surname && adress && city && phone && psc){

            const user_data_template = get_user_data_template(login_data[0].users[0].id, name, surname, phone, adress, city, psc)
            
            const [api_responce, err] = await edit_record(user_data_template, user_data.id, login_data[0].users[0].id)

            if(err){
                set_error_msg("error ocured")
            }else{
                if(api_responce.duplicit_value !== true){
                    navigate('/account-info', {state: {msg: "data edited"}})
                }else{
                    set_error_msg("duplicit value")
                }
            }
        }
    }

    return(
        <>
            <p>{error_msg}</p>

            {login_data[0].users[0].login_status === "Active" ? 
                <>
                    <div>
                        <form onSubmit={handleSubmit}>
                            
                                <div>
                                    <label htmlFor="name">name</label>
                                    <input id={"name"} type="text" value={name} onChange={(e) => set_name(e.target.value)}></input>

                                    <label htmlFor="surname">surname</label>
                                    <input id={"surname"} type="text" value={surname} onChange={(e) => set_surname(e.target.value)}></input>

                                    <label htmlFor="adress">adress</label>
                                    <input id={"adress"} type="text" value={adress} onChange={(e) => set_adress(e.target.value)}></input>

                                    <label htmlFor="city">city</label>
                                    <input id={"city"} type="text" value={city} onChange={(e) => set_city(e.target.value)}></input>
                                    
                                    <label htmlFor="phone">adress</label>
                                    <input id={"phone"} type="text" value={phone} onChange={(e) => set_phone(e.target.value)}></input>

                                    <label htmlFor="psc">psc</label>
                                    <input id={"psc"} type="text" value={psc} onChange={(e) => set_psc(e.target.value)}></input>
                                </div>
                            
                            
                            <button>send</button>
                        </form>
                    </div>
                </> : <Access_denied></Access_denied>
            }
        </>
    )
}