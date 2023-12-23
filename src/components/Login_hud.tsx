import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import login_data from "../data/login_data.json"

import change_status from "../apis/change_status";

export default function Login_hud(){
    
    const navigate = useNavigate()
        
    const [responce_data, setResponce_data] = useState({login_status: login_data[0].users[0].login_status, user_id: login_data[0].users[0].id, username: login_data[0].users[0].username, login_msg: ""});

    var handle_on_click = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
    
        var tables = {
            users: {login_status: "Inactive"},
        }

        const respoce_data = await change_status(tables, login_data[0].users[0].id, login_data[0].users[0].id)

        navigate("/login", {state: respoce_data})
    }

    return(
        <>
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
                                <Link to="/user-menu">{responce_data.username}</Link>
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