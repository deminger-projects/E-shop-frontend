import { useState } from 'react';   
import { useNavigate } from 'react-router-dom';

import Admin_collection_select from '../../../components/Admin/Admin_collection_select';
import Admin_size_checkboxes from "../../../components/Admin/Admin_size_checkboxes"
import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import Access_denied from '../../user/Access_denied';

import login_data from "../../../data/login_data.json"

import add_record from '../../../apis/add_record';

import Tables from "../../../interfaces/Tables"
import Size from "../../../interfaces/Size"
import Files from '../../../interfaces/Files';

import filter_sizes from '../../../functions/filters/filter_sizes';
import filter_files from '../../../functions/filters/filter_files';
import set_up_sizes from '../../../functions/set_ups/set_up_sizes';

export default function Admin_product_add(){

    const navigate = useNavigate();

    const size_set_up = set_up_sizes()

    const [name, setName] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [collection, setCollection] = useState<string>("NULL");
    const [description, setDescription] = useState<string>("");

    const [files, set_files] = useState<Files>()

    const [sizes, set_sizes] = useState<Array<Size>>(size_set_up)

    const [error_msg, set_error_msg] = useState<string>();
    const [responce_msg, set_responce_msg] = useState<string>();

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        event.preventDefault();

        if(files){

            const filtred_sizes = filter_sizes(sizes)
            const filtred_files = filter_files(files)

            if(!files.main){set_error_msg("select main image")}
            if(!files.hover){set_error_msg("select hover image")}
    
            if((files.model_show_case?.status === true && filtred_files.show_case_status.model_show_case !== true) || (files.detail_show_case?.status === true && filtred_files.show_case_status.detail_show_case !== true)){set_error_msg("show case missing images")}

            if(!name){set_error_msg("name is empty")}
            if(!cost){set_error_msg("cost is empty")}
            if(!description){set_error_msg("description is empty")}
            if(filtred_files.files_names_tables.length <= 0){set_error_msg("select image")}
            if(filtred_sizes.sizes.length <= 0){set_error_msg("select size")}

            
            if(name && cost && description && filtred_files.files_names_tables.length > 0 && filtred_sizes.sizes.length > 0 && files.main && files.hover && ((files.model_show_case?.status === true && filtred_files.show_case_status.model_show_case === true) || files.model_show_case?.status === false) && ((files.detail_show_case?.status === true && filtred_files.show_case_status.detail_show_case === true) || files.detail_show_case?.status === false)){            
    
                var tables: Tables
    
                if(collection === "NULL"){
                     tables = {
                        products: {name$: name, price: cost, description: description},
                        product_sizes: {product_id: null, size: filtred_sizes.sizes, current_amount: filtred_sizes.amounts},
                        product_images: {product_id: null, image_url$: filtred_files.files_names_tables}
                    }
                }else{
                     tables = {
                        products: {collection_id: collection, name$: name, price: cost, description: description},
                        product_sizes: {product_id: null, size: filtred_sizes.sizes, current_amount: filtred_sizes.amounts},
                        product_images: {product_id: null, image_url$: filtred_files.files_names_tables}
                    }
                }
    
                const [api_responce, error] = await add_record(tables, login_data[0].users[0].id, "products", filtred_files.files)    
                
                if(api_responce.duplicit_value === true){
                    set_responce_msg("duplicit name")
                }else{
                    if(error){
                        set_error_msg("error ocured")
                    }else{
                        if(api_responce.status === true){
                            navigate("/admin_product_page", {state: {msg: api_responce.msg}})
                        }
                        set_responce_msg(api_responce.msg)
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
                    
                    <Admin_image_add settings={{hover: true, detail_show_case: true, model_show_case: true}} on_change={set_files}></Admin_image_add>

                    <br></br>

                    <button>add</button>

                </form>
            </div> : <Access_denied></Access_denied>}
        </>
    )
}
