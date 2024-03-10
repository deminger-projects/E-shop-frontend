import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Cookies from 'universal-cookie';

import login_reguest from '../../apis/login/login_request';
import get_login_template from '../../templates/login/get_login_template';
import { useCookies } from 'react-cookie';

export default function Login(){

    const navigate = useNavigate();
    const location = useLocation()

    const [email, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [cookies, set_cookies] = useCookies();

    const [error_msg, set_error_msg] = useState<string>(location.state ? location.state.msg : "");



    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();

        set_error_msg("")

        if(!password){set_error_msg("password is missing")}
        if(!email){set_error_msg("email is missing")}

        if(email && password){

            const login_template = get_login_template(email, password)
            
            const [api_responce, error] = await login_reguest(login_template)
            console.log("🚀 ~ handleSubmit ~ api_responce:", api_responce)

            if(error){
                set_error_msg("error ocured")
            }else{
                if(api_responce.next_status){
                    set_cookies("user_data", api_responce.user_data, {path: "/"})
                    sessionStorage.setItem('user_account_data', JSON.stringify(api_responce.user_account_data));

                    navigate("/main");
                }else{
                    set_error_msg(api_responce.msg)
                }
            }
        }
    }

    return(
        <>            
            <p>{error_msg}</p>

            <div className='login_register_div'>
                <form onSubmit={(event) => handleSubmit(event)} encType="multipart/form-data">

                    <label htmlFor="login_emain">{"Emain"}</label>
                    <input id="login_emain" type="email" value={email} onChange={(e) => setName(e.target.value)}></input>
                    <br></br>

                    <label htmlFor="login_password">{"Password"}</label>
                    <input id="login_password" type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <br></br>

                    <button>Login</button>
                    
                </form>
            </div>

            <Link to={"/forgoten-password"}>forgot password</Link>
        </>
    )
}