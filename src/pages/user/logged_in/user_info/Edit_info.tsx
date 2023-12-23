import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Access_denied from "../../Access_denied";

import login_data from "../../../../data/login_data.json"

import edit_record from "../../../../apis/edit_record";

export default function Edit_info(){
    
    const navigate = useNavigate();
    const user_data = useLocation().state.data;

    const [username, set_username] = useState<string>(user_data.username);
    const [email, set_email] = useState<string>(user_data.email);

    const [error_msg, set_error_msg] = useState<string>();

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();

        if(!username){set_error_msg("username is empty")}
        if(!email){set_error_msg("email is empty")}

        if(username && email){

            var tables = {users: {username: username, email$: email}}

            const api_responce = await edit_record(tables, user_data.id, login_data[0].users[0].id)

            navigate('/account-info', {state: {msg: "data changed"}})

        }
    }

    return(
        <>
            <p>{error_msg}</p>

            {login_data[0].users[0].login_status === "Active" ? 
                <>
                    <div>
                        <form onSubmit={handleSubmit}>
                             
                                <div>
                                    <label htmlFor="username">username</label>
                                    <input id={"username"} type="text" value={username} onChange={(e) => set_username(e.target.value)}></input>
                
                                    <label htmlFor="email">email</label>
                                    <input id={"email"} type="text" value={email} onChange={(e) => set_email(e.target.value)}></input>
                                </div>
                        
                            
                            <button>send</button>
                        </form>
                    </div>
                </> : <Access_denied></Access_denied>
            }
        </>
    )
}