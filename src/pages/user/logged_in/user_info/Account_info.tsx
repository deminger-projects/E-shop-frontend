import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import AccessDenied from "../../Access_denied";

import change_status from "../../../../apis/records/change_status";

import UserData, {User_data} from "../../../../interfaces/user/User_data"
import get_account_info_template from "../../../../templates/user/get_account_info_template";
import get_user_acccount_data from "../../../../apis/getters/user/get_user_account_data";
import Loading from "../../../../components/Loading";

export default function Account_info(){

    const location = useLocation()
    
    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "");
    const [error_msg, set_error_msg] = useState<string>("")

    const [delivery_data, set_delivery_data] = useState<Array<UserData>>([])

    const [loading, set_loading] = useState<boolean>(true)

    const [update, set_update] = useState<boolean>(false)

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    useEffect(() => {

        set_loading(true)
        
        const fetchData = async () => {
            var data = await get_user_acccount_data(user_data[0].email, user_data[0].password)

            set_delivery_data(data)
            set_loading(false);
          };

        fetchData()
    },[update, user_data])

    var handle_delete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, user_data: User_data) => {

        set_loading(true)

        event.preventDefault();

        const account_info_template = get_account_info_template()

        const [api_responce, error] = await change_status(account_info_template, user_data.id, delivery_data[0].users[0].id)

        if(error){
            set_error_msg("error ocured")
        }else if(api_responce.next_status === true){
            set_responce_msg('info deleted')
        }else{
            set_responce_msg(api_responce.msg)
        }

        set_update(!update)
        set_loading(false)
    }

    return(
        <>
            {loading ? <Loading></Loading> : <>
                <p>{responce_msg}</p>
                <p>{error_msg}</p>

                {user_data.length > 0 ?

                    <>
                            
                    {delivery_data !== undefined && delivery_data[0].user_data.length > 0 ?    

                    <><table>
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
                                           
                        {delivery_data[0].user_data.map((user_data: User_data, index: number) =>                     
                            
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
                        ) } 

                    </tbody>
                    </table>
                        </>
                : <p>no delivery info</p>} 
                           

                        <button><Link to="/add-delivery-info">add info</Link></button>

                    </> : <AccessDenied></AccessDenied> 
                }
            </>}
            
        </>
    )
}