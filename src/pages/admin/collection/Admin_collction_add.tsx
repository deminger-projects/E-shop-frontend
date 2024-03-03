import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Access_denied from '../../user/Access_denied';

import login_data from "../../../data/login_data.json"

import add_record from '../../../apis/records/add_record';

import filter_files from '../../../functions/filters/filter_files';

import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import Files from '../../../interfaces/Files';
import set_up_files from '../../../functions/set_ups/set_up_files';
import get_filtred_data from '../../../functions/get_filtred_data';
import get_edit_collection_template from '../../../templates/admin/get_edit_collection_template';

export default function Admin_collection_add(){
    
    const navigate = useNavigate();

    const [collection_name, set_collection_name] = useState<string>("");  

    var file_set_up = set_up_files(undefined, undefined, undefined)

    const [urls, set_urls] = useState<{main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>(file_set_up.ulrs)
    const [files, set_files] = useState<Files>()

    const [error_msg, set_error_msg] = useState<string>("");  

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(files){

            var filtred_data = get_filtred_data(urls, files, file_set_up.ulrs)

            if(!files.main){set_error_msg("select main image")}

            if(!collection_name){set_error_msg("collection name is empty")}
            if(filtred_data.file_names_for_table.length <= 0){set_error_msg("select image")}
    
            if(collection_name && filtred_data.file_names_for_table.length > 0 && files.main){

                const collection_edit_template = get_edit_collection_template(collection_name, null, filtred_data.file_names_for_table)
                
                const [api_responce, error] = await add_record(collection_edit_template, login_data[0].users[0].id, "collections", filtred_data.files_to_save)
    
                if(api_responce.duplicit_value === true){
                    set_error_msg("duplicit name")
                }else{
                    if(error){
                        set_error_msg("error ocured")
                    }else{
                        if(api_responce.status === true){
                            navigate("/admin_collection_page", {state: {msg: api_responce.msg}})
                        }else{
                            set_error_msg(api_responce.msg)
                        }
                    }
                }
                
            }
        }else{
            set_error_msg("select files")
        }
    }

    return(
        <>
            <p>{error_msg}</p>

            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? <div className="admin_add_collection">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    
                    <label htmlFor="collection_name_add">{"Collection name"}</label>
                    <input id="collection_name_add" type="text" name="collection_name_add" value={collection_name} onChange={(e) => set_collection_name(e.target.value)}></input>
                    <br></br>
                    <br></br>

                    <Admin_image_add on_change={set_files} on_delete={set_urls}></Admin_image_add>

                    <button>save</button>

                </form>
            </div> : <Access_denied></Access_denied>}
        </>
    )
}

