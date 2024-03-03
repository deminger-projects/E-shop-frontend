import { useState } from 'react';   
import { useNavigate } from 'react-router-dom';

import Admin_collection_select from '../../../components/Admin/Admin_collection_select';
import Admin_size_checkboxes from "../../../components/Admin/Admin_size_checkboxes"
import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import Access_denied from '../../user/Access_denied';

import login_data from "../../../data/login_data.json"

import add_record from '../../../apis/records/add_record';

import Tables from "../../../interfaces/Tables"
import Size from "../../../interfaces/Size"
import Files from '../../../interfaces/Files';

import filter_sizes from '../../../functions/filters/filter_sizes';
import filter_files from '../../../functions/filters/filter_files';
import set_up_sizes from '../../../functions/set_ups/set_up_sizes';
import set_up_files from '../../../functions/set_ups/set_up_files';
import get_filtred_data from '../../../functions/get_filtred_data';
import get_product_template from '../../../templates/admin/get_product_template';

export default function Admin_product_add(){

    const navigate = useNavigate();

    const size_set_up = set_up_sizes()

    var file_set_up = set_up_files(undefined, undefined, undefined)

    const [urls, set_urls] = useState<{main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>(file_set_up.ulrs)

    const [name, setName] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [collection, setCollection] = useState<string>();
    const [description, setDescription] = useState<string>("");

    const [files, set_files] = useState<Files>()

    const [sizes, set_sizes] = useState<Array<Size>>(size_set_up)

    const [error_msg, set_error_msg] = useState<string>("");
    const [responce_msg, set_responce_msg] = useState<string>("");

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();

        if(files){

            const filtred_data = get_filtred_data(urls, files, file_set_up.ulrs)
            const filtred_sizes = filter_sizes(sizes)

            if(!files.main){set_error_msg("select main image")}
            if(!files.hover){set_error_msg("select hover image")}
    
            if((files.model_show_case?.status === true && filtred_data.model_show_case_status !== true) || (files.detail_show_case?.status === true && filtred_data.detail_show_case_status !== true)){set_error_msg("show case missing images")}

            if(!name){set_error_msg("name is empty")}
            if(!cost){set_error_msg("cost is empty")}
            if(!description){set_error_msg("description is empty")}
            if(filtred_data.file_names_for_table.length <= 0){set_error_msg("select image")}
            if(filtred_sizes.sizes.length <= 0){set_error_msg("select size")}

            if(name && cost && description && filtred_data.file_names_for_table.length > 0 && filtred_sizes.sizes.length > 0 && files.main && files.hover && ((files.model_show_case?.status === true && filtred_data.model_show_case_status === true) || files.model_show_case?.status === false) && ((files.detail_show_case?.status === true && filtred_data.detail_show_case_status === true) || files.detail_show_case?.status === false)){            
    
                const product_template = get_product_template(Number(collection), name, Number(cost), description, filtred_sizes.sizes, null, filtred_sizes.amounts, filtred_data.file_names_for_table, files)
    
                const [api_responce, error] = await add_record(product_template, login_data[0].users[0].id, "products", filtred_data.files_to_save)    

                if(error){
                    set_error_msg("error ocured")
                }else if(api_responce.next_status === true){
                    navigate("/admin_product_page", {state: {msg: api_responce.msg}})
                }else{
                    set_responce_msg(api_responce.msg)
                }
            }
        }else{
            set_error_msg("select files")
        }
    }

    return(
        <>
            <p>{error_msg}</p>
            <p>{responce_msg}</p>

            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? <div className="admin_add_product">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    
                    <label htmlFor="product_name">{"Product name"}</label>
                    <input id="product_name" type="text" name="product_name" value={name} onChange={(e) => setName(e.target.value)}></input>
                    <br></br>
                    <br></br>
                
                    <label htmlFor="product_cost">{"Product prize"}</label>
                    <input id="product_cost" type="number" name="product_cost" value={cost} onChange={(e) => setCost(e.target.value)} min="0"></input>
                    <br></br>
                    <br></br>

                    <label htmlFor="product_collection">Product collection</label>

                    <select id="product_collection" name="product_collection" value={collection} onChange={(e) => setCollection (e.target.value)}>
                        <Admin_collection_select></Admin_collection_select>
                    </select>
                    
                    <br></br>
                    <br></br>

                    <label htmlFor="product_description">{"Product description"}</label>
                    <input id="product_description" type="text" name="product_description" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                    <br></br>
                    <br></br>

                    <div className="admin_add_sizes">
                        <Admin_size_checkboxes sizes={sizes} on_change={set_sizes}></Admin_size_checkboxes>
                    </div>

                    <br></br>
                    
                    <Admin_image_add settings={{hover: true, detail_show_case: true, model_show_case: true}} on_delete={set_urls} on_change={set_files}></Admin_image_add>

                    <br></br>

                    <button>add</button>

                </form>
            </div> : <Access_denied></Access_denied>}
        </>
    )
}
