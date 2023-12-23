import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import user_data from "../../../../data/user_data.json"
import login_data from "../../../../data/login_data.json"

import Access_denied from "../../Access_denied";

import change_status from "../../../../apis/change_status";

import {DeliveryData} from "../../../../interfaces/user/User_data"

export default function Account_info(){

    const location = useLocation()
    
    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "");
    const [error_msg, set_error_msg] = useState<string>()

    var handle_delete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, user_data: DeliveryData) => {

        event.preventDefault();

        var tables = {
            user_data: {status: "Inactive"}
        }

        const [api_responce, error] = await change_status(tables, user_data.id, login_data[0].users[0].id)

        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }
    }

    return(
        <>
            <p>{responce_msg}</p>
            <p>{error_msg}</p>

            {login_data[0].users[0].login_status === "Active" ?

                <>
                    <table>
                        <thead>
                            <tr>
                                <th>username</th>
                                <th>email</th>
                            </tr>
                        </thead>

                            <tbody>
                                <tr>
                                    <td><p>{user_data[0].users[0].username}</p></td>
                                    <td><p>{user_data[0].users[0].email}</p></td>
                                    <td><button><Link to={"/edit-user-info"} state={{data: user_data[0].users[0]}}>edit</Link></button></td>
                                </tr>
                            </tbody>      
                    </table>

                    <table>
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>surname</th>
                                <th>phone</th>
                                <th>adress</th>
                                <th>city</th>
                                <th>psc</th>
                                <th>status</th>
                            </tr>
                        </thead>

                        <tbody>
                        
                {user_data[0].user_data.length === 0 ? <p>no delivery_data</p> :                           
                    user_data[0].user_data.map((user_data: DeliveryData, index: number) =>                     
                        
                            <tr key={index.toString()}>
                                <td><p>{user_data.name}</p></td>
                                <td><p>{user_data.surname}</p></td>
                                <td><p>{user_data.phone}</p></td>
                                <td><p>{user_data.adress}</p></td>
                                <td><p>{user_data.city}</p></td>
                                <td><p>{user_data.postcode}</p></td>
                                <td><p>{user_data.status}</p></td>
                                <td><button><Link to={"/edit-delivery-info"} state={{data: user_data}}>edit</Link></button></td>
                                <td><button onClick={(event) => handle_delete(event, user_data)}>delete</button></td>
                            </tr>         
                    )    
            }
                        </tbody>
                    </table>

                    <button><Link to="/add-delivery-info">add info</Link></button>

                </> : <Access_denied></Access_denied>
            }
        </>
    )
}