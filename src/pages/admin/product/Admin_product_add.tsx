import { useEffect, useState } from 'react';   
import { useNavigate } from 'react-router-dom';

import Admin_collection_select from '../../../components/Admin/Admin_collection_select';
import Admin_size_checkboxes from "../../../components/Admin/Admin_size_checkboxes"
import Admin_image_add from '../../../components/Admin/Admin_add_image_handler';

import Access_denied from '../../user/Access_denied';

import add_record from '../../../apis/records/add_record';

import Size from "../../../interfaces/Size"
import Files from '../../../interfaces/Files';

import filter_sizes from '../../../functions/filters/filter_sizes';
import set_up_sizes from '../../../functions/set_ups/set_up_sizes';
import set_up_files from '../../../functions/set_ups/set_up_files';
import get_filtred_data from '../../../functions/get_filtred_data';
import get_product_template from '../../../templates/admin/get_product_template';
import { useCookies } from 'react-cookie';
import check_for_admin from '../../../functions/sub_functions/check_for_admin';
import get_admin_collections from '../../../apis/getters/admin/get_admin_collections';
import Loading from '../../../components/Loading';
import Image_test from '../../../components/Admin/Image_test';
import filter_images from '../../../functions/filters/filter_images';

export default function Admin_product_add(){

    const navigate = useNavigate();

    const size_set_up = set_up_sizes()

    var file_set_up = set_up_files(undefined, undefined, undefined)

    const [urls, set_urls] = useState<{main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>(file_set_up.ulrs)

    const [name, setName] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [collection, setCollection] = useState<string>();
    const [description, setDescription] = useState<string>("");

    const [files, set_files] = useState<any>({main: undefined, hover: undefined, other: [], model_show_case: [], detail_show_case: []})

    const [sizes, set_sizes] = useState<Array<Size>>(size_set_up)

    const [error_msg, set_error_msg] = useState<string>("");
    const [responce_msg, set_responce_msg] = useState<string>("");

    const [cookies, setCookie] = useCookies(['user_data'])

    const [loading, set_loading] = useState(true)

    const [collections, set_collections] = useState()

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    const [files_to_delete, set_files_to_delete] = useState<Array<string>>([])

    useEffect(() => {
        set_loading(true)

        const temp = async() => {
            var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

            if(is_admin.next_status === true){
                set_is_admin(true)
                set_loading(false);

            }
        }

        temp()
    }, [])

    useEffect(() => {
        set_loading(true)

        const fetchData = async () => {
            var data = await get_admin_collections()

            set_collections(data)
            set_loading(false);
          };

        fetchData()
    }, [])

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)
        
        event.preventDefault();

        if(files){

            //const filtred_data = get_filtred_data(urls, files, file_set_up.ulrs)
            const filtred_sizes = filter_sizes(sizes)

            var new_data = filter_images(files, urls)

            if(!files.main){set_error_msg("Must select main image")}
            if(!files.hover){set_error_msg("Must select hover image")}
            if(files.model_show_case.length < 4){set_error_msg("Must select model image")}
            if(files.detail_show_case.length < 4){set_error_msg("Must select detail image")}

    
            // if((files.model_show_case?.status === true && filtred_data.model_show_case_status !== true) || (files.detail_show_case?.status === true && filtred_data.detail_show_case_status !== true)){set_error_msg("show case missing images")}

            if(!name){set_error_msg("Name is missing")}
            if(!cost){set_error_msg("Price is missing")}
            if(!description){set_error_msg("Description is missing")}
            //if(filtred_data.file_names_for_table.length <= 0){set_error_msg("Must select image")}
            if(filtred_sizes.sizes.length <= 0){set_error_msg("Must Select size")}

            if(name && cost && description && filtred_sizes.sizes.length > 0 && new_data.model_files.length === 4 && new_data.detail_files.length === 4 && files.main && files.hover){            
    
                const product_template = get_product_template(Number(collection), name, Number(cost), description, filtred_sizes.sizes, null, filtred_sizes.amounts, new_data.files_names_for_tables, files)
    
                const [api_responce, error] = await add_record(product_template, cookies.user_data[0].id, "products", new_data.files_for_save)    

                if(error){
                    set_error_msg("error ocured")
                }else if(api_responce.next_status === true){
                    navigate("/admin_product_page", {state: {msg: api_responce.msg}})
                }else{
                    set_responce_msg(api_responce.msg)
                    set_error_msg("")
                }

            }
        }else{
            set_error_msg("Must select files")
        }

        set_loading(false)
    }

    return(
        <>

            {loading ? <Loading></Loading> : <>
                <p>{error_msg}</p>
                <p>{responce_msg}</p>

                {is_admin ? <div className="admin_add_product">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        <label htmlFor="product_name">{"Product name"}</label>
                        <input id="product_name" type="text" name="product_name" value={name} onChange={(e) => setName(e.target.value)}></input>
                        <br></br>
                        <br></br>
                    
                        <label htmlFor="product_cost">{"Product price"}</label>
                        <input id="product_cost" type="number" name="product_cost" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="€" min="0"></input>
                        <br></br>
                        <br></br>

                        <label htmlFor="product_collection">Product collection</label>

                        <select id="product_collection" name="product_collection" value={collection} onChange={(e) => setCollection (e.target.value)}>
                            <Admin_collection_select collections={collections}></Admin_collection_select>
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
                        
                  {     // <Admin_image_add settings={{hover: true, detail_show_case: true, model_show_case: true}} on_delete={set_urls} on_change={set_files}></Admin_image_add>
                  }

                        <Image_test default_files={files} change_files={set_files} change_urls={set_urls} default_urls={urls} files_to_delete={files_to_delete} change_files_to_delete={set_files_to_delete} settings={{hover: true, model_show_case: true, detail_show_case: true, other: false}}></Image_test>

                        <br></br>

                        <button>Add</button>

                    </form>
                </div> : <Access_denied></Access_denied>}
            </>}
            
        </>
    )
}
