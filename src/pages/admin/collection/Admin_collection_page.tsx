import { useState } from "react";
import {Link} from "react-router-dom";

import login_data from "../../../data/login_data.json"
import colletions from "../../../data/collections.json"

import Access_denied from '../../user/Access_denied';

import Collections from "../../../interfaces/Collections";

import change_status from "../../../apis/change_status";

export default function Admin_collection_page(){

    const [responce_msg, set_responce_msg] = useState<string>()
    const [error_msg, set_error_msg] = useState<string>()

    var handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>, record_id: number) =>{

        event.preventDefault();

        var tables = {
            collections: {status: "Inactive"},
        }

        const [api_responce, error] = await change_status(tables, record_id) 
        
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

            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? colletions.length !== 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>collection name</th>
                            <th>image</th>
                        </tr>
                    </thead>
                    
                    <tbody>

                {colletions.map((collection: Collections) => 
                        <tr key={collection.collections[0].id}>
                            <td><p key={collection.collections[0].name}>{collection.collections[0].name}</p></td>
                            <td>                            
                                <img src={"images/collections/" + collection.collections[0].id + "/" + collection.collections[0].image_url} width={"100px"} height={"100px"}></img>
                            </td>     
                            <td>
                                <Link to="/admin_collection_edit" state={collection}>
                                        <button key={collection.collections[0].id + "s"}>EDIT</button>
                                </Link>
                            </td>
                            <td>                           
                                <button onClick={(event) => handleSubmit(event, collection.collections[0].id)}>DELETE</button>
                            </td>
                        </tr>
                )}
                    </tbody>
                </table>
            : <p>no records</p>
            : <Access_denied></Access_denied>
            }
        </>
    )
}