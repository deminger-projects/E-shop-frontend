import { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";

import Access_denied from '../../user/Access_denied';

import Collections from "../../../interfaces/Collections";

import change_status from "../../../apis/records/change_status";
import get_change_collection_template from "../../../templates/admin/get_change_collection_template";
import { useCookies } from "react-cookie";
import check_for_admin from "../../../functions/sub_functions/check_for_admin";

export default function Admin_collection_page(){

    const location = useLocation();

    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "")
    const [error_msg, set_error_msg] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)

    const [search_value, set_search_value] = useState<string>("")
    const [search_collections, set_search_collections] = useState<Array<Collections>>([])
    const [search_collections_display, set_search_collections_display] = useState<Array<Collections>>([])

    const [cookies, setCookie] = useCookies(['user_data'])

    const [update, set_update] = useState<boolean>(true);

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    useEffect(() => {
        const temp = async() => {
            var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

            if(is_admin.next_status === true){
                set_is_admin(true)
            }
        }

        temp()
    }, [])

    useEffect(() => {
        var res_arr: Array<Collections> = []

        for(var colletion of search_collections){             
            if(search_value){
                var new_collection: Collections = colletion

                if(new_collection.collections[0].name.toLocaleLowerCase().includes(search_value.toLocaleLowerCase())){
                    res_arr.push(colletion)
                }
            }
        }   

        if(!search_value){
            set_search_collections_display(search_collections)
        }else{
            set_search_collections_display(res_arr)
        }

    },[search_value])

    useEffect(() => {
        fetchData()
    }, [update])

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
          set_search_collections_display(data)
          set_loading(false);

        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };


    var handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>, record_id: number) =>{

        set_loading(true)

        event.preventDefault();

        const change_collection_status_template = get_change_collection_template()

        const [api_responce, error] = await change_status(change_collection_status_template, record_id) 
        
        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }

        set_update(!update)
    }

    return( 
        <>

            {loading ? <p>loading</p> : <>
                <input type="text" value={search_value} onChange={(event) => set_search_value(event.target.value)}/>

                <p>{responce_msg}</p>
                <p>{error_msg}</p>

                {is_admin ? search_collections_display.length !== 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>collection name</th>
                                <th>image</th>
                                <th>add date</th>
                            </tr>
                        </thead>
                        
                        <tbody>

                    {search_collections_display.map((collection: Collections) => 
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
