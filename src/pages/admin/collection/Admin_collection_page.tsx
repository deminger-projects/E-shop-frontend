import { useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import AccessDenied from '../../user/Access_denied';

import Collections from "../../../interfaces/Collections";

import change_status from "../../../apis/records/change_status";
import get_change_collection_template from "../../../templates/admin/get_change_collection_template";
import check_for_admin from "../../../functions/sub_functions/check_for_admin";
import get_admin_collections from "../../../apis/getters/admin/get_admin_collections";
import Loading from "../../../components/Loading";
import Roll_button from "../../../components/Roll_button";
import get_admin_collection_images from "../../../apis/getters/admin/get_admin_collection_images";
import Product from "../../../interfaces/Product";

export default function Admin_collection_page(){

    const navigate = useNavigate();
    const location = useLocation();

    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "")
    const [error_msg, set_error_msg] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)

    const [search_value, set_search_value] = useState<string>("")
    const [search_collections, set_search_collections] = useState<Array<Collections>>([])
    const [search_collections_display, set_search_collections_display] = useState<Array<Collections>>([])

    const [update, set_update] = useState<boolean>(true);

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    useEffect(() => {
        const temp = async() => {
            set_loading(true)

                if(user_data.length > 0){
                    var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

                    if(is_admin.next_status === true){
                        set_is_admin(true)
                    }

                    set_loading(false);

            }
            
            set_loading(false);
        }

        temp()
    }, [user_data])

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

    },[search_value, search_collections])

    useEffect(() => {
        set_loading(true)

        const fetchData = async () => {
            var data = await get_admin_collections()

            set_search_collections(data)
            set_search_collections_display(data)
            set_loading(false);
          };

        fetchData()
    }, [update, user_data])

    
    var handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>, record_id: number) =>{

        set_loading(true)

        event.preventDefault();

        const change_collection_status_template = get_change_collection_template()

        const [api_responce, error] = await change_status(change_collection_status_template, record_id) 
        
        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg("Record succesfully deleted")
        }

        set_update(!update)
    }

    var handle_click = async (event:React.MouseEvent<HTMLElement>, id: number, collection: Collections) => {

        set_loading(true)

        event.preventDefault();

        var data1 = await get_admin_collection_images(id)

        var images_arr = []

        for(var image of data1){
            images_arr.push(image.collection_images[0])
        }

        var new_data = {collections: collection, collection_images: images_arr}        
        
        set_loading(false)

        navigate("/admin_collection_edit", {state: {collection_data: new_data}});
    }

    return( 
        <>

            {loading ? <Loading></Loading> : <>
                <br />
                <input type="text" value={search_value} onChange={(event) => set_search_value(event.target.value)}/>

                <Link to={'/admin_collection_add'}>Add collection</Link>

                <p>{responce_msg}</p>
                <p>{error_msg}</p>

                {is_admin ? search_collections_display.length !== 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Collection name</th>
                                <th>Collection preview</th>
                                <th>Add date</th>
                            </tr>
                        </thead>
                        
                        <tbody>

                    {search_collections_display.map((collection: Collections) => 
                            <tr key={collection.collections[0].id}>
                                <td><p>{collection.collections[0].name}</p></td>
                                <td>                            
                                    <img alt={collection.collections[0].name} src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/collections/" + collection.collections[0].id + "/" + collection.collections[0].image_url} width={"100px"} height={"100px"}></img>
                                </td>    

                                <td><p>{collection.collections[0].add_date}</p></td>

                                <td>
                                    <button onClick={(event) => handle_click(event, collection.collections[0].id, collection)}>EDIT</button>
                                </td>

                                <td>                           
                                    <button onClick={(event) => handleSubmit(event, collection.collections[0].id)}>DELETE</button>
                                </td>
                            </tr>      
                    )}
                        </tbody>
                    </table>
                : <p>No collections available</p>
                : <AccessDenied></AccessDenied>
                }

                
                
            </>}
        </>
    )
}
