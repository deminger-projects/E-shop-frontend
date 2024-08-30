import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Access_denied from '../../user/Access_denied';

import add_record from '../../../apis/records/add_record';

import filter_files from '../../../functions/filters/filter_files';

import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import Files from '../../../interfaces/Files';
import set_up_files from '../../../functions/set_ups/set_up_files';
import get_filtred_data from '../../../functions/get_filtred_data';
import get_edit_collection_template from '../../../templates/admin/get_edit_collection_template';
import { useCookies } from 'react-cookie';
import check_for_admin from '../../../functions/sub_functions/check_for_admin';
import Loading from '../../../components/Loading';

export default function Admin_collection_add(){
    
    const navigate = useNavigate();

    const [collection_name, set_collection_name] = useState<string>("");  

    const [loading, set_loading] = useState<boolean>(false);  

    const [cookies, setCookie] = useCookies(['user_data'])

    var file_set_up = set_up_files(undefined, undefined, undefined)

    const [urls, set_urls] = useState<{main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>(file_set_up.ulrs)
    const [files, set_files] = useState<Files>()

    const [error_msg, set_error_msg] = useState<string>("");  

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    useEffect(() => {
        set_loading(true)

        const temp = async() => {
            var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

            if(is_admin.next_status === true){
                set_is_admin(true)
                set_loading(false)
            }
        }

        temp()
    }, [])

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();

        if(files){

            var filtred_data = get_filtred_data(urls, files, file_set_up.ulrs)

            if(!files.main){set_error_msg("Must select main image")}

            if(!collection_name){set_error_msg("Collection name is missing")}
            if(filtred_data.file_names_for_table.length <= 0){set_error_msg("select image")}
    
            if(collection_name && filtred_data.file_names_for_table.length > 0 && files.main){

                const collection_edit_template = get_edit_collection_template(collection_name, null, filtred_data.file_names_for_table)
                
                const [api_responce, error] = await add_record(collection_edit_template, cookies.user_data[0].id, "collections", filtred_data.files_to_save)
    
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

        set_loading(false)
    }

    return(
        <>

            {loading ? <Loading></Loading> : <>
                <p>{error_msg}</p>

                {is_admin ? <div className="admin_add_collection">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        <label htmlFor="collection_name_add">{"Collection name"}</label>
                        <input id="collection_name_add" type="text" name="collection_name_add" value={collection_name} onChange={(e) => set_collection_name(e.target.value)}></input>
                        <br></br>
                        <br></br>

                        <Admin_image_add on_change={set_files} on_delete={set_urls}></Admin_image_add>

                        <button>Save</button>

                    </form>
                </div> : <Access_denied></Access_denied>}
            </>}
            
        </>
    )
}

