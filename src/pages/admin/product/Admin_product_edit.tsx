import { useState } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';

import Admin_size_checkboxes from '../../../components/Admin/Admin_size_checkboxes';
import Admin_collection_select from "../../../components/Admin/Admin_collection_select"
import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import Access_denied from '../../user/Access_denied';

import login_data from "../../../data/login_data.json"

import edit_record from '../../../apis/edit_record';

import set_up_sizes from '../../../functions/set_ups/set_up_sizes';
import filter_sizes from '../../../functions/filters/filter_sizes';
import filter_files from '../../../functions/filters/filter_files';
import set_up_files from '../../../functions/set_ups/set_up_files';

import Table from "../../../interfaces/Tables"
import Size from "../../../interfaces/Size"
import File from '../../../interfaces/Files';

export default function Admin_product_edit(){

    const navigate = useNavigate();
    const location = useLocation()

    const file_set_up = set_up_files(location.state.product_images, location.state.products[0], "products")
    const size_set_up = set_up_sizes(location.state.product_sizes)

    const [name, setName] = useState<string>(location.state.products[0].product_name);
    const [collection, setCollection] = useState<string>(location.state.products[0].collection_id);
    const [cost, setCost] = useState<string>(location.state.products[0].price);
    const [description, setDescription] = useState<string>(location.state.products[0].description);

    const [files, set_files] = useState<File>()
    const [sizes, set_sizes] = useState<Array<Size>>(size_set_up)

    const [error_msg, set_error_msg] = useState<string>()

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const filtred_sizes = filter_sizes(sizes)
        
        if(!name){set_error_msg("name is empty")}
        if(!cost){set_error_msg("cost is empty")}
        if(!description){set_error_msg("description is empty")}
        if(filtred_sizes.sizes.length <= 0){set_error_msg("select sizes")}
    
        if(name && cost && description && filtred_sizes.sizes.length > 0){

            if(files){
                const filtred_files = filter_files(files, file_set_up.urls_without_path)

                var tables : Table
    
                if(collection === "NULL"){
                     tables = {
                        products: {collection_id: "NULL", name$: name, price: cost, description: description},
                        product_sizes: {product_id: location.state.products[0].id, size: filtred_sizes.sizes, current_amount: filtred_sizes.amounts},
                        product_images: {product_id: location.state.products[0].id, image_url: filtred_files.files_names_tables}
                    }
                }else{
                     tables = {
                        products: {collection_id: collection, name$: name, price: cost, description: description},
                        product_sizes: {product_id: location.state.products[0].id, size: filtred_sizes.sizes, current_amount: filtred_sizes.amounts},
                        product_images: {product_id: location.state.products[0].id, image_url: filtred_files.files_names_tables}
                    }
                }

                const [api_responce, error] = await edit_record(tables, location.state.products[0].id, login_data[0].users[0].id, filtred_files.files, filtred_files.file_names_to_keep, "products")
    
                if(error){
                    set_error_msg("error ocured")
                }else{
                    navigate("/admin_product_page", {state: {msg: api_responce.msg}})
                }

            }else{
                var tables : Table
    
                if(collection === "NULL"){
                     tables = {
                        products: {collection_id: "NULL", name$: name, price: cost, description: description},
                        product_sizes: {product_id: location.state.products[0].id, size: filtred_sizes.sizes, current_amount: filtred_sizes.amounts},
                    }
                }else{
                     tables = {
                        products: {collection_id: collection, name$: name, price: cost, description: description},
                        product_sizes: {product_id: location.state.products[0].id, size: filtred_sizes.sizes, current_amount: filtred_sizes.amounts},
                    }
                }

                const [api_responce, error] = await edit_record(tables, location.state.products[0].id, login_data[0].users[0].id, undefined, file_set_up.files_to_keep, "products")
                
                if(api_responce.duplicit_value === true){
                    set_error_msg("duplicit name")
                }else{
                    if(error){
                        set_error_msg("error ocured")
                    }else{
                        navigate("/admin_product_page", {state: {api_responce}})
                    }
                }
                
            }
        }
    }

    return(
        <>

            <p>{error_msg}</p>
            
            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? <div>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>

                    <label htmlFor="product_name_edit">{"Product name"}</label>
                    <input id="product_name_edit" type="text" name="product_name_edit" value={name} onChange={(e) => setName(e.target.value)}></input>
                    <br></br>
                    <br></br>


                    <label htmlFor="product_collection_edit">{"Product collection"}</label>
                    <select id="product_collection_edit" value={collection ? collection : ""} onChange={(e) => setCollection(e.target.value)}>
                        <Admin_collection_select></Admin_collection_select>
                    </select>

                    <br></br>
                    <br></br>

                    <label htmlFor="product_cost_edit">{"Product cost"}</label>
                    <input id="product_cost_edit" type="number" name="product_cost_edit" value={cost} onChange={(e) => setCost(e.target.value)}></input>
                    <br></br>
                    <br></br>

                    <label htmlFor="product_description_edit">{"Product description"}</label>
                    <input id="product_description_edit" type="text" name="product_description_edit" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                    <br></br>
                    <br></br>

                    <Admin_size_checkboxes sizes={sizes} on_change={set_sizes}></Admin_size_checkboxes>

                    <br></br>
                    <br></br>

                    <Admin_image_add on_change={set_files} default_urls={file_set_up.ulrs} settings={{hover: true, model_show_case: true, detail_show_case: true}}></Admin_image_add>

                    <button>save</button>

                </form>
            </div> : <Access_denied></Access_denied>}
        </>
    )
}
