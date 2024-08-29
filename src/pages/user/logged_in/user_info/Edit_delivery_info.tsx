import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Access_denied from "../../Access_denied";

import edit_record from "../../../../apis/records/edit_record";
import get_user_data_template from "../../../../templates/user/get_user_data_template";
import Loading from "../../../../components/Loading";

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

    const [loading, set_loading] = useState<boolean>(false);

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();
        
        if(!name){set_error_msg("name is empty")}
        if(!surname){set_error_msg("surname is empty")}
        if(!adress){set_error_msg("adress is empty")}
        if(!city){set_error_msg("city is empty")}
        if(!phone){set_error_msg("phone is empty")}
        if(!psc){set_error_msg("postcode is empty")}

        if(name && surname && adress && city && phone && psc){

            const user_data_template = get_user_data_template(user_data.user_id, name, surname, phone, adress, city, psc)
            
            const [api_responce, err] = await edit_record(user_data_template, user_data.id)
            
            if(err){
                set_error_msg("error ocured")
            }else{
                if(api_responce.next_status === true){
                    navigate('/account-info', {state: {msg: "data edited"}})
                }else{
                    set_error_msg("duplicit value")
                }
            }
        }

        set_loading(false)
    }

    return(
        <>
            {loading ? <Loading></Loading> : <>
                <p>{error_msg}</p>

                {user_data ? 
                    <>
                        <div>
                            <form onSubmit={handleSubmit}>
                                
                                    <div>
                                        <label htmlFor="name">Name</label>
                                        <input id={"name"} type="text" value={name} onChange={(e) => set_name(e.target.value)}></input>

                                        <label htmlFor="surname">Surname</label>
                                        <input id={"surname"} type="text" value={surname} onChange={(e) => set_surname(e.target.value)}></input>

                                        <label htmlFor="adress">Adress</label>
                                        <input id={"adress"} type="text" value={adress} onChange={(e) => set_adress(e.target.value)}></input>

                                        <label htmlFor="city">City</label>
                                        <input id={"city"} type="text" value={city} onChange={(e) => set_city(e.target.value)}></input>
                                        
                                        <label htmlFor="phone">Adress</label>
                                        <input id={"phone"} type="text" value={phone} onChange={(e) => set_phone(e.target.value)}></input>

                                        <label htmlFor="psc">PSČ</label>
                                        <input id={"psc"} type="text" value={psc} onChange={(e) => set_psc(e.target.value)}></input>
                                    </div>
                                
                                
                                <button>Proceed</button>
                            </form>
                        </div>
                    </> : <Access_denied></Access_denied>
                }
                </>}
        </>
    )
}