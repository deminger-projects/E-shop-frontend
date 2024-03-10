import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Access_denied from "../../Access_denied";

import Cookies from 'universal-cookie';

import change_status from "../../../../apis/records/change_status";

import UserData, {User_data} from "../../../../interfaces/user/User_data"
import get_account_info_template from "../../../../templates/user/get_account_info_template";
import { useCookies } from "react-cookie";

export default function Account_info(){

    const location = useLocation()
    
    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "");
    const [error_msg, set_error_msg] = useState<string>("")

    const [delivery_data, set_delivery_data] = useState<Array<UserData>>()
    console.log("🚀 ~ Account_info ~ delivery_data:", delivery_data)
    const [loading, set_loading] = useState<boolean>(true)

    const [update, set_update] = useState<boolean>(false)

    const [cookies, setCookie] = useCookies(["user_data"])

    useEffect(() => {
        fetchData()
    }, [update])

    const fetchData = async () => {
        try {

            const id = cookies.user_data[0].id

            const form_data = new FormData()

            form_data.append("id", JSON.stringify(id))

          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_user_acccount_data', {
            method: 'POST',
            body: form_data
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          console.log("🚀 ~ fetchData ~ data:", data)
          
          set_delivery_data(data)
          set_loading(false);

        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };

    var handle_delete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, user_data: User_data) => {

        set_loading(true)

        event.preventDefault();

        const account_info_template = get_account_info_template()

        const [api_responce, error] = await change_status(account_info_template, user_data.id, cookies.user_data[0].id)

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
            {loading ? <p>loading</p> : <>
                <p>{responce_msg}</p>
                <p>{error_msg}</p>

                {cookies.user_data[0].login_status === "Active" ?

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
                                        <td><p>{cookies.user_data[0].username}</p></td>
                                        <td><p>{cookies.user_data[0].email}</p></td>
                                        <td><button><Link to={"/edit-user-info"} state={{data: cookies.user_data[0]}}>edit</Link></button></td>
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
                            
                    {delivery_data ?                           
                        delivery_data[0].user_data.map((user_data: User_data, index: number) =>                     
                            
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
                : ""} 
                            </tbody>
                        </table>

                        <button><Link to="/add-delivery-info">add info</Link></button>

                    </> : <Access_denied></Access_denied> 
                }
            </>}
            
        </>
    )
}