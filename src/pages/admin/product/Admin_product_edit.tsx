import { useEffect, useState } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';

import Admin_size_checkboxes from '../../../components/Admin/Admin_size_checkboxes';
import Admin_collection_select from "../../../components/Admin/Admin_collection_select"
import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import Access_denied from '../../user/Access_denied';

import edit_record from '../../../apis/records/edit_record';

import set_up_sizes from '../../../functions/set_ups/set_up_sizes';
import filter_sizes from '../../../functions/filters/filter_sizes';
import set_up_files from '../../../functions/set_ups/set_up_files';

import Size from "../../../interfaces/Size"
import get_filtred_data from '../../../functions/get_filtred_data';
import get_product_template from '../../../templates/admin/get_product_template';
import { useCookies } from 'react-cookie';
import check_for_admin from '../../../functions/sub_functions/check_for_admin';
import get_admin_collections from '../../../apis/getters/admin/get_admin_collections';
import Loading from '../../../components/Loading';
import get_product_by_id from '../../../apis/getters/get_product_by_id';

export default function Admin_product_edit(){

    const navigate = useNavigate();
    const location = useLocation()

    const file_set_up = set_up_files(location.state.product_images, location.state.products[0], "products")
    const size_set_up = set_up_sizes(location.state.product_sizes)

    // const [name, setName] = useState<string>(location.state.products[0].product_name);
    // const [collection, setCollection] = useState<string>(location.state.products[0].collection_id);
    // const [cost, setCost] = useState<string>(location.state.products[0].price);
    // const [description, setDescription] = useState<string>(location.state.products[0].description);

    const [name, setName] = useState<string>("");
    const [collection, setCollection] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [files, set_files] = useState<any>({main: undefined, hover: undefined, other: [], model_show_case: {status: file_set_up.model_status, data: []}, detail_show_case: {status: file_set_up.detail_status, data: []}})
    const [sizes, set_sizes] = useState<Array<Size>>(size_set_up)
    const [urls, set_urls] = useState<{main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>(file_set_up.ulrs)

    const [error_msg, set_error_msg] = useState<string>("")

    const [cookies, setCookie] = useCookies(['user_data'])

    const [fetch_collekec, set_fetch_collekec] = useState()
    const [loading, set_loading] = useState(true)

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
        const fetchData = async () => {
            var data = await get_admin_collections()

            set_fetch_collekec(data)
            set_loading(false);
          };

        fetchData()
    }, [])


    useEffect(() => {
        set_loading(true)

        const fetch_data = async () => {
            var data = await get_product_by_id(location.state.products[0].id)

            setName(data[0].products[0].product_name)
            setCollection(data[0].products[0].collection_id)
            setCost(data[0].products[0].price)
            setDescription(data[0].products[0].description)

            const file_set_up = set_up_files(data[0].product_images, data[0].products[0], "products")
            const size_set_up = set_up_sizes(data[0].product_sizes)

            set_files({main: undefined, hover: undefined, other: [], model_show_case: {status: file_set_up.model_status, data: []}, detail_show_case: {status: file_set_up.detail_status, data: []}})
            set_urls(file_set_up.ulrs)
            set_sizes(size_set_up)
        }

        fetch_data()

        set_loading(false)
    }, [])

   

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();

        const filtred_sizes = filter_sizes(sizes)
        const filtred_data = get_filtred_data(urls, files, file_set_up.ulrs)
        
        if(!name){set_error_msg("name is empty")}
        if(!cost){set_error_msg("cost is empty")}
        if(!description){set_error_msg("description is empty")}
        if(filtred_sizes.sizes.length <= 0){set_error_msg("select sizes")}

        if(files){
            if(((files.model_show_case?.status === true && filtred_data.model_show_case_status !== true) || (files.detail_show_case?.status === true && filtred_data.detail_show_case_status !== true))){set_error_msg("missing images in show case")}
        }

        if(name && cost && description && filtred_sizes.sizes.length > 0){
        
            const product_template = get_product_template(collection, name, Number(cost), description, filtred_sizes.sizes, location.state.products[0].id, filtred_sizes.amounts, filtred_data.file_names_for_table, files)

            if(files){
                if(((files.model_show_case?.status === true && filtred_data.model_show_case_status === true) || files.model_show_case?.status === false) && ((files.detail_show_case?.status === true && filtred_data.detail_show_case_status === true) || files.detail_show_case?.status === false)){
                    const [api_responce, error] = await edit_record(product_template, location.state.products[0].id, cookies.user_data[0].id, filtred_data.files_to_save, filtred_data.file_names_to_keep, "products")

                    if(error){
                        set_error_msg("error ocured")
                    }else if(api_responce.next_status === true){
                        navigate("/admin_product_page", {state: {msg: api_responce.msg}})
                    }else if(api_responce.next_status === false){
                        set_error_msg(api_responce.msg)
                    }
                }
            }else{
                const [api_responce, error] = await edit_record(product_template, location.state.products[0].id, cookies.user_data[0].id, filtred_data.files_to_save, filtred_data.file_names_to_keep, "products")

                if(error){
                    set_error_msg("error ocured")
                }else if(api_responce.next_status === true){
                    navigate("/admin_product_page", {state: {msg: api_responce.msg}})
                }else if(api_responce.next_status === false){
                    set_error_msg(api_responce.msg)
                }
            }
        }

        set_loading(false)
    }

    return(
        <>

            {loading ? <Loading></Loading> : <>
                <p>{error_msg}</p>
                
                {is_admin ? <div>
                    <form onSubmit={handleSubmit} encType='multipart/form-data'>

                        <label htmlFor="product_name_edit">{"Product name"}</label>
                        <input id="product_name_edit" type="text" name="product_name_edit" value={name} onChange={(e) => setName(e.target.value)}></input>
                        <br></br>
                        <br></br>


                        <label htmlFor="product_collection_edit">{"Product collection"}</label>
                        <select id="product_collection_edit" value={collection ? collection : ""} onChange={(e) => setCollection(e.target.value)}>
                            <Admin_collection_select collections={fetch_collekec}></Admin_collection_select>
                        </select>

                        <br></br>
                        <br></br>

                        <label htmlFor="product_cost_edit">{"Product price"}</label>
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

                        <Admin_image_add on_delete={set_urls} on_change={set_files} default_files={files} default_urls={file_set_up.ulrs} settings={{hover: true, model_show_case: true, detail_show_case: true}}></Admin_image_add>

                        <button>save</button>

                    </form>
                </div> : <Access_denied></Access_denied>}
            </>}
        </>
    )
}
