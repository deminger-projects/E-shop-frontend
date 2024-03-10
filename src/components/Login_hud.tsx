import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoff from "../apis/login/logoff";
import get_logoff_teplate from "../templates/login/get_logoff_teplate";
import { useCookies } from "react-cookie";

export default function Login_hud(){

    const navigate = useNavigate()

    const [err_msg, set_error_msg] = useState<string>("")

    const [cookies, set_cookies] = useCookies(['user_data', 'user_account_data']);

    var handle_on_click = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        event.preventDefault();

        const logoff_template = get_logoff_teplate()

        const [api_responce, err] = await logoff(logoff_template, cookies.user_data[0].id, cookies.user_data[0].id)

        if(err){
            set_error_msg(err)
        }else{
            set_cookies("user_data", [], {path: "/"})

            navigate("/login", {state: api_responce})
        }
    }

    return(
        <>
            <p>{err_msg}</p>

            <div id={"login_data"}>
                {cookies.user_data[0] !== undefined ? 
                    cookies.user_data[0].login_status === "Active" && cookies.user_data[0].username === "Admin" ? 
                        <>
                            <div>
                                <Link to="/user-menu">{cookies.user_data[0].username}</Link>
                                <br></br>
                                <button onClick={handle_on_click}>log out</button>
                                <br></br>
                                <Link to="/admin_page">{"admin page"}</Link>
                            </div>  
                        </>
                    :    
                        <>
                            <div>
                                <Link to="/user-menu">{cookies.user_data[0].username}</Link>
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