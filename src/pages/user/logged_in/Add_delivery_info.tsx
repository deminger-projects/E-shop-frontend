import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Access_denied from "../Access_denied";

import add_record from "../../../apis/records/add_record";
import get_user_data_template from "../../../templates/user/get_user_data_template";
import { useCookies } from "react-cookie";

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

    const [cookies, setCookie] = useCookies(['user_data'])

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

          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_user_data', {
            method: 'POST',
            body: form_data
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_user_id(data)
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
        if(!PSC){set_error_msg("postcode is empty")}

        if(name && surname && email && telephone && adress && city && PSC){

            const user_data_template = get_user_data_template(Number(user_id.id), name, surname, telephone, adress, city, PSC)

            const [api_responce, error] = await add_record(user_data_template, Number(user_id.id), undefined, undefined, undefined, cookies.user_data[0].login_status)
            
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

        set_loading(false)
    }

    return(
        <>
            {loading ? <p>loading</p> : <>
                <p>{error_msg}</p>

                {cookies.user_data[0].login_status  === "Active" ? 
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
            </>}
            
        </>
    )
}