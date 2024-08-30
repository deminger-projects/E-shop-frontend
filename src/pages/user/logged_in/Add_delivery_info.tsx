import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Access_denied from "../Access_denied";

import add_record from "../../../apis/records/add_record";
import get_user_data_template from "../../../templates/user/get_user_data_template";
import get_user_data from "../../../apis/getters/user/get_user_data";
import Loading from "../../../components/Loading";

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

    const [loading, set_loading] = useState<boolean>(false);
    const [user_id, set_user_id] = useState<any>("");

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    useEffect(() => {
        const fetchData = async () => {
            var id = await get_user_data(user_data[0].email, user_data[0].password)

            set_user_id(id)
            set_loading(false);
        }
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
        if(!PSC){set_error_msg("postcode is empty")}

        if(name && surname && email && telephone && adress && city && PSC){

            const user_data_template = get_user_data_template(Number(user_id.id), name, surname, telephone, adress, city, PSC)

            const [api_responce, error] = await add_record(user_data_template, Number(user_id.id), undefined, undefined, undefined, user_data[0].login_status)
            
            if(error){
                set_error_msg("error ocured")
            }else{
                if(api_responce.next_status === true){
                    navigate('/account-info', {state: {msg: "Customer information successfully added"}})
                }else{
                    set_error_msg(api_responce.msg)
                }  
            }    
        }

        set_loading(false)
    }

    return(
        <>
            {loading ? <Loading></Loading> : <>
                <p>{error_msg}</p>

                {user_data.length > 0 ? 
                    <>
                        <p>Add delivery infonations</p>

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
                                
                                <label htmlFor="telephone">{"Phone number"}</label>
                                <input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}></input>
                                <br></br>

                                <label htmlFor="adress">{"Adress"}</label>
                                <input id="adress" type="text" value={adress} onChange={(e) => setAdress(e.target.value)}></input>
                                <br></br>

                                <label htmlFor="city">{"City"}</label>
                                <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)}></input>
                                <br></br>

                                <label htmlFor="PSC">{"PSČ"}</label>
                                <input id="PSC" type="number" value={PSC} onChange={(e) => setPSC(e.target.value)}></input>
                                <br></br>

                                <button>Proceed</button>

                            </form>
                        </div>
                    </> : <Access_denied></Access_denied>
                }
            </>}
            
        </>
    )
}