import { useState } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';

import Access_denied from '../../user/Access_denied';

import login_data from "../../../data/login_data.json"

import edit_record from '../../../apis/edit_record';

import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import filter_files from '../../../functions/filters/filter_files';
import set_up_files from '../../../functions/set_ups/set_up_files';

import Files from '../../../interfaces/Files';
import Tables from "../../../interfaces/Tables"

export default function Admin_collection_edit(){

    const navigate = useNavigate();
    const location = useLocation();

    const file_set_up = set_up_files(location.state.collection_images, location.state.collections[0], "collections")
    
    const [collection_name, setCollection_name] = useState<string>(location.state.collections[0].name);
    const [files, set_files] = useState<Files>()

    const [err_msg, set_err_msg] = useState<string>()

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!collection_name){set_err_msg("empty collection name")}

        if(collection_name){
            var tables: Tables

            if(files){
                const filtred_files = filter_files(files)
    
                tables = {
                    collections: {name: collection_name, add_date: Date()},
                    collection_images: {collection_id: location.state.collections[0].id, image_url: filtred_files.files_names_tables}
                }

                const [api_responce, error] = await edit_record(tables, location.state.collections[0].id, login_data[0].users[0].id, filtred_files.files, filtred_files.file_names_to_keep, "collections")
        
                if(error){
                    set_err_msg("error ocured")
                }else{
                    navigate("/admin_collection_page", {state: {msg: api_responce.msg}})
                }

            }else{
                tables = {
                    collections: {name: collection_name, add_date: Date()},
                    collection_images: {collection_id: location.state.collections[0].id}
                }

                const [api_responce, error] = await edit_record(tables, location.state.collections[0].id, login_data[0].users[0].id, [], file_set_up.files_to_keep, "collections")
                
                if(api_responce.duplicit_value === true){
                    set_err_msg("duplicit name")
                }else{
                    if(error){
                        set_err_msg("error ocured")
                    }else{
                        navigate("/admin_collection_page", {state: {msg: api_responce.msg}})
                    }
                }
                
            }
        }   
    }

    return(
        <>

            <p>{err_msg}</p>

            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? <div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">

                    <label htmlFor="collection_edit">{"Collection name"}</label>
                    <input id="collection_edit" type="text" name="collection_edit" value={collection_name} onChange={(e) => setCollection_name(e.target.value)}></input>
                    <br></br>
                    <br></br>

                    <Admin_image_add default_urls={file_set_up.ulrs} on_change={set_files}></Admin_image_add>

                    <button>save</button>

                </form>
            </div> : <Access_denied></Access_denied>}
        </>
    )
}