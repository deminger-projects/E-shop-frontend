import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import register_request from '../../apis/login/register_request';
import get_register_template from '../../templates/login/get_register_template';
import { useCookies } from 'react-cookie';
import Loading from '../../components/Loading';

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

    const [loading, set_loading] = useState<boolean>(false);
    
    const [cookies, set_cookies] = useCookies()

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();

        if(password !== password_again){set_err_msg("passwords do not match")}
        
        if(!psc){set_err_msg("PSČ is missing")}
        if(!name){set_err_msg("Name is missing")}
        if(!surname){set_err_msg("Surname is missing")}
        if(!telephone){set_err_msg("Phone number is missing")}
        if(!adress){set_err_msg("Adress is missing")}
        if(!city){set_err_msg("City is missing")}

        if(!email){set_err_msg("Email is missing")}
        if(!password){set_err_msg("Password is missing")}        
        if(!username){set_err_msg("Username is missing")}
        
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

        set_loading(false)
    }

    return(
        <>

            {loading? <Loading></Loading> : <>
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
        
                            <label htmlFor="telephone">{"Phone number"}</label>
                            <input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}></input>
                            <br></br>
        
                            <label htmlFor="adress">{"Adress"}</label>
                            <input id="adress" type="text" value={adress} onChange={(e) => setAdress(e.target.value)}></input>
                            <br></br>
        
                            <label htmlFor="city">{"City"}</label>
                            <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)}></input>
                            <br></br>
        
                            <label htmlFor="PSC">{"PSC"}</label>
                            <input id="PSC" type="text" value={psc} onChange={(e) => setPsc(e.target.value)}></input>
                            <br></br>

                
                            <br />
                            <br />
                            <br />
        
                            <button>Register</button>
        
                        </form>
                    </div>
            </>}
            
        </>
    )
}