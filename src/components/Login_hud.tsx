import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import login_data from "../data/login_data.json"

import logoff from "../apis/login/logoff";
import get_logoff_teplate from "../templates/login/get_logoff_teplate";

export default function Login_hud(){

    const navigate = useNavigate()

    const [err_msg, set_error_msg] = useState<string>("")

    var handle_on_click = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        event.preventDefault();

        const logoff_template = get_logoff_teplate()

        const [api_responce, err] = await logoff(logoff_template, login_data[0].users[0].id, login_data[0].users[0].id)

        if(err){
            set_error_msg(err)
        }else{
            navigate("/login", {state: api_responce})
        }
    }

    return(
        <>
            <p>{err_msg}</p>

            <div id={"login_data"}>
                {login_data[0].users[0].login_status === "Active" ? 
                    login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? 
                        <>
                            <div>
                                <Link to="/user-menu">{login_data[0].users[0].username}</Link>
                                <br></br>
                                <button onClick={handle_on_click}>log out</button>
                                <br></br>
                                <Link to="/admin_page">{"admin page"}</Link>
                            </div>  
                        </>
                    :    
                        <>
                            <div>
                                <Link to="/user-menu">{login_data[0].users[0].username}</Link>
                                <br></br>
                                <button onClick={handle_on_click}>log out</button>
                            </div>  
                        </>
                :
                    <>
                        <div>
                            <Link to="/login">{"login"}</Link>
                            <p>--------</p>
                            <Link to="/register">{"register"}</Link>
                        </div>
                    </>
                }
            </div>
        </>
    )
}