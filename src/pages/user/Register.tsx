import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import register_request from '../../apis/register_request';

export default function Register(){

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [email, setEmail] = useState<string>();

    const [name, setName] = useState<string>();
    const [surname, setSurname] = useState<string>();
    const [telephone, setTelephone] = useState<string>();
    const [adress, setAdress] = useState<string>();
    const [city, setCity] = useState<string>();
    const [psc, setPsc] = useState<string>();

    const [msg, set_msg] = useState<string>();
    const [err_msg, set_err_msg] = useState<string>();

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!username){set_err_msg("username is empty")}
        if(!password){set_err_msg("password is empty")}
        if(!email){set_err_msg("email is empty")}

        if(!name){set_err_msg("name is empty")}
        if(!surname){set_err_msg("surname is empty")}
        if(!telephone){set_err_msg("telephone is empty")}
        if(!adress){set_err_msg("adress is empty")}
        if(!city){set_err_msg("city is empty")}
        if(!psc){set_err_msg("psc is empty")}


        if(username && password && email && name && surname && telephone && adress && city && psc){

            var tables = {
                users: {username: username, email$: email, password: password},
                users_data: {user_id: null, name: name, surname: surname, phone: telephone, adress: adress, city: city, postcode: psc},
            }
        
            const [api_responce, error] = await register_request(tables)

            if(error){
                set_err_msg("error ocured")
            }else{
                if(!api_responce.status){
                    navigate("/user_index");
                }else{
                    set_msg("email already used")
                }
            }
        }
    }

    return(
        <>
            <p>{msg}</p>
            <p>{err_msg}</p>

            <div className='login_register_div'>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
    
                        <label htmlFor="username">{"Username"}</label>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <br></br>
    
                        <label htmlFor="password">{"Password"}</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
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