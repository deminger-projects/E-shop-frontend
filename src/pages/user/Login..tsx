import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import login_data from "../../data/login_data.json"

import login_reguest from '../../apis/login_request';

export default function Login(){

    const navigate = useNavigate();

    const [name, setName] = useState<string>();
    const [password, setPassword] = useState<string>();

    const [responce_msg, set_responce_msg] = useState<string>();
    const [error_msg, set_error_msg] = useState<string>();

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();

        if(name && password){
            var tables = {
                users: {email$: name, password$: password, login_status: "Active"}
            }

            const [api_responce, error] = await login_reguest(tables)

            if(error){
                set_error_msg("error ocured")
            }else{
                if(api_responce.status){
                    navigate("/main");
                }else{
                    set_responce_msg(api_responce.msg)
                }
            }
        }
    }

    return(
        <>

            <p>{login_data[0].users[0].username}</p>
            
            <br></br>

            <p>{responce_msg}</p>
            
            <p>{error_msg}</p>

            <div className='login_register_div'>
                <form onSubmit={(event) => handleSubmit(event)} encType="multipart/form-data">

                    <label htmlFor="login_emain">{"Emain"}</label>
                    <input id="login_emain" type="email" value={name} onChange={(e) => setName(e.target.value)}></input>
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