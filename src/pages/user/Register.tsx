import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import register_request from '../../apis/login/register_request';
import get_register_template from '../../templates/login/get_register_template';
import { useCookies } from 'react-cookie';

export default function Register(){

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password_again, set_password_again] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [adress, setAdress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [psc, setPsc] = useState<string>("");

    const [err_msg, set_err_msg] = useState<string>("");
    
    const [cookies, set_cookies] = useCookies()

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(password !== password_again){set_err_msg("passwords do not match")}
        
        if(!psc){set_err_msg("psc is empty")}
        if(!name){set_err_msg("name is empty")}
        if(!surname){set_err_msg("surname is empty")}
        if(!telephone){set_err_msg("telephone is empty")}
        if(!adress){set_err_msg("adress is empty")}
        if(!city){set_err_msg("city is empty")}

        if(!email){set_err_msg("email is empty")}
        if(!password){set_err_msg("password is empty")}        
        if(!username){set_err_msg("username is empty")}
        
        if(username && password && email && name && surname && telephone && adress && city && psc && password === password_again){

            const register_template = get_register_template(username, email, password, name, surname, telephone, adress, city, psc)

            const [api_responce, error] = await register_request(register_template)

            if(error){
                set_err_msg("error ocured")
            }else{
                if(api_responce.next_status === true){
                    sessionStorage.setItem('user_data', JSON.stringify(api_responce.user_data));
                    set_cookies("user_data", JSON.stringify(api_responce.user_data))

                    navigate("/main", {state: {msg: api_responce.msg}});
                }else{
                    set_err_msg(api_responce.msg)
                }
            }
        }
    }

    return(
        <>
            <p>{err_msg}</p>

            <div className='login_register_div'>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
    
                        <label htmlFor="username">{"Username"}</label>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <br></br>
    
                        <label htmlFor="password">{"Password"}</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <br></br>

                        <label htmlFor="password_again">{"Password again"}</label>
                        <input id="password_again" type="password" value={password_again} onChange={(e) => set_password_again(e.target.value)}></input>
                        <br></br>
    
                        <label htmlFor="email">{"Email"}</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <br></br>
    
                        <br></br>
                        <br></br>
                        <br></br>

                        
                        <label htmlFor="name">{"Name"}</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                        <br></br>
    
                        <label htmlFor="surname">{"Surname"}</label>
                        <input id="surname" type="text" value={surname} onChange={(e) => setSurname(e.target.value)}></input>
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
                        <input id="PSC" type="number" value={psc} onChange={(e) => setPsc(e.target.value)}></input>
                        <br></br>

            
                        <br />
                        <br />
                        <br />
    
                        <button>Register</button>
    
                    </form>
                </div>
        </>
    )
}