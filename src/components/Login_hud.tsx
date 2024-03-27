import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoff from "../apis/login/logoff";
import get_logoff_teplate from "../templates/login/get_logoff_teplate";
import check_for_admin from "../functions/sub_functions/check_for_admin";
import { useCookies } from "react-cookie";

export default function Login_hud(){

    const navigate = useNavigate()

    const [err_msg, set_error_msg] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(false)

    const [user_data, set_user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    const [cookies, set_cookies] = useCookies(["user_data"])

    useEffect(() => {
        const temp = async() => {
            if(user_data.length > 0){
                var is_admin = await check_for_admin(cookies.user_data[0].email, cookies.user_data[0].password)

                if(is_admin.next_status === true){
                    set_is_admin(true)
                }
            }
        }

        temp()
    }, [])

    var handle_on_click = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        set_loading(true)

        event.preventDefault();

        const logoff_template = get_logoff_teplate()

        const [api_responce, err] = await logoff(logoff_template, cookies.user_data[0].email, cookies.user_data[0].password)

        if(err){
            set_error_msg(err)
        }else{
            sessionStorage.setItem('user_data', JSON.stringify([]));
            set_cookies("user_data", JSON.stringify([]))
            set_user_data([])
            navigate("/login", {state: api_responce})
        }

        set_loading(false)
    }

    return(
        <> 
            {loading ? <p>loading</p> : <>
                <p>{err_msg}</p>

                <div id={"login_data"}>
                    {user_data.length > 0 || cookies.user_data[0] ? 
                        is_admin ? 
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
            </>}
        </>
    )
}