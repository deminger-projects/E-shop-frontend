import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

import login_data from "../../../data/login_data.json"
import colletions from "../../../data/new_collections.json"
import colletions2 from "../../../data/collections_NN.json"

import Access_denied from '../../user/Access_denied';

import Collections from "../../../interfaces/Collections";

import change_status from "../../../apis/records/change_status";
import get_change_collection_template from "../../../templates/admin/get_change_collection_template";

export default function Admin_collection_page(){

    const [responce_msg, set_responce_msg] = useState<string>("")
    const [error_msg, set_error_msg] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)

    const [search_value, set_search_value] = useState<string>("")
    const [search_collections, set_search_collections] = useState<Array<Collections>>([])

    useEffect(() => {
        var res_arr: Array<Collections> = []

        for(var colletion of colletions){             
            if(search_value){
                var new_collection: Collections = colletion

                if(new_collection.collections[0].name.includes(search_value)){
                    res_arr.push(colletion)
                }
            }
        }   

        if(search_value){
            set_search_collections(res_arr)
        }else{
            set_search_collections(colletions)
        }

    },[search_value])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_collections', {
            method: 'POST'  
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_search_collections(data)
          set_loading(false);

        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };


    var handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>, record_id: number) =>{

        event.preventDefault();

        const change_collection_status_template = get_change_collection_template()

        const [api_responce, error] = await change_status(change_collection_status_template, record_id) 
        
        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }
    }

    return( 
        <>

            {loading ? <p>loading</p> : <>
                <input type="text" value={search_value} onChange={(event) => set_search_value(event.target.value)}/>

                <p>{responce_msg}</p>
                <p>{error_msg}</p>

                {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? colletions.length !== 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>collection name</th>
                                <th>image</th>
                                <th>add date</th>
                            </tr>
                        </thead>
                        
                        <tbody>

                    {search_collections.map((collection: Collections) => 
                            <tr key={collection.collections[0].id}>
                                <td><p>{collection.collections[0].name}</p></td>
                                <td>                            
                                    <img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/collections/" + collection.collections[0].id + "/" + collection.collections[0].image_url} width={"100px"} height={"100px"}></img>
                                </td>    

                                <td><p>{collection.collections[0].add_date}</p></td>

                                <td>
                                    <Link to="/admin_collection_edit" state={collection}>
                                            <button>EDIT</button>
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
            </>}
        </>
    )
}
