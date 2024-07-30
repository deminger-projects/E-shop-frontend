import { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";

import AccessDenied from '../../user/Access_denied';

import Product from "../../../interfaces/Product";

import change_status from "../../../apis/records/change_status";
import AdminCollectionSelect from "../../../components/Admin/Admin_collection_select";
import get_product_status_change_template from "../../../templates/admin/get_product_status_change_template";
import check_for_admin from "../../../functions/sub_functions/check_for_admin";
import get_admin_collections from "../../../apis/getters/admin/get_admin_collections";
import get_admin_products from "../../../apis/getters/admin/get_admin_products";
import Loading from "../../../components/Loading";
import Roll_button from "../../../components/Roll_button";
import get_more_products from "../../../functions/get_more_products";

export default function Admin_product_page(){ 
    
    const location = useLocation();

    const [roll_button_status, set_roll_button_status] = useState<boolean>(false)
    const [last_item_id, set_last_item_id] = useState<number>(0)

    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "")
    const [error_msg, set_error_msg] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)

    const [search, set_search] = useState<string>("")
    const [search_collection, set_search_collection] = useState<string>("")

    const [products_arr, set_products_arr] = useState<Array<Product>>([]);
    const [products_arr_display, set_products_arr_display] = useState<Array<Product>>([]);
    
    const [fetch_collections, set_fetch_collections] = useState<any>();

    const [update, set_update] = useState<boolean>(true);

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    useEffect(() => {
        const temp = async() => {
            if(user_data.length > 0){
                var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

                if(is_admin.next_status === true){
                    set_is_admin(true)
                }
            }
        }

        temp()
    }, [user_data])


    useEffect(() => {      // searches products based on user input, valid input: product name, product size
        var res_arr: Array<Product> = []

        for(var product of products_arr){ 
            var new_product: Product = product

            if(search && search_collection){
                if(new_product.products[0].collection_id){
                    if(new_product.products[0].product_name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) && new_product.products[0].collection_id.toString().includes(search_collection)){
                        res_arr.push(product)
                    }
                    
                }else{
                    if((search_collection === "null" || search_collection === null) && new_product.products[0].collection_id === null && new_product.products[0].product_name.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                        res_arr.push(product)
                    }
                }
            }else if(search_collection){
                if(new_product.products[0].collection_id){
                    if(new_product.products[0].collection_id.toString().includes(search_collection)){
                        res_arr.push(product)
                    }
                }

                if((search_collection === "null" || search_collection === null) && new_product.products[0].collection_id === null){
                    res_arr.push(product)
                }
            }else if(search){
                if(new_product.products[0].product_name.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                    res_arr.push(product)
                }
            }
        }   

        if(!search && !search_collection){
            set_products_arr_display(products_arr)
        }else{
            set_products_arr_display(res_arr)
        }
       
    },[search, search_collection, products_arr])

    useEffect(() => {
        const fetchData = async () => {
            var collecions = await get_admin_collections()
            var products = await get_admin_products(last_item_id)
            console.log("🚀 ~ fetchData ~ products:", products)

            if(products.length < 9){
                set_roll_button_status(false)
            }

            set_roll_button_status(true)

            set_products_arr(products)
            set_fetch_collections(collecions)
            set_products_arr_display(products)
    
            set_loading(false);
          };

        fetchData()        
    }, [update, user_data])


    var handleSubmit = async (event: React.MouseEvent<HTMLElement>, record_id: number) =>{   

        set_loading(true)
        
        event.preventDefault();

        const product_status_change_template = get_product_status_change_template()

        const [api_responce, error] = await change_status(product_status_change_template, record_id)

        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }

        set_update(!update)
    }


    var get_more_products = async () => {
        set_loading(true)

        var data1 = await get_admin_products(last_item_id)

        if(data1.length > 0){
            var products_arr_copy = [...products_arr]
            var new_data = products_arr_copy.concat(data1)
    
            set_products_arr(new_data)
            set_products_arr_display(new_data)
    
            set_last_item_id(data1[data1.length - 1].products[0].id)
            
            if(data1.length < 9){
                set_roll_button_status(false)
            }
            set_roll_button_status(true)
        }else{
            set_roll_button_status(false)
        }

        set_loading(false)
    }
   

    return( 
        <>

            {loading ? <Loading></Loading> : <>
                <p>{responce_msg}</p>
                <p>{error_msg}</p>

                <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

                <select value={search_collection} onChange={(event) => set_search_collection(event.target.value)}>
                    <option value={""}>select collection</option>
                    <AdminCollectionSelect collections={fetch_collections}></AdminCollectionSelect>
                </select>            

                {is_admin ? products_arr_display.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>product name</th>
                                <th>cost</th>
                                <th>description</th>
                                <th>collection</th>
                                <th>main image</th>
                                <th>add date</th>
                            </tr>
                        </thead>
                        
                        <tbody>

                        {products_arr_display.map((product: Product) => 
                            <tr key={product.products[0].id}>
                                <td><p>{product.products[0].product_name}</p></td>
                                <td><p>{product.products[0].price}</p></td>
                                <td><p>{product.products[0].description}</p></td>
                                {product.products[0].collection_name === null ? <td><p>NONE</p></td> : <td><p>{product.products[0].collection_name}</p></td>}
                                
                                <td>
                                    <img alt={product.products[0].product_name} src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + product.products[0].id + "/" + product.products[0].url} width={"100px"} height={"100px"}></img>
                                </td>

                                <td><p>{product.products[0].add_date}</p></td>

                                <td>
                                    <Link to="/admin_product_edit" state={product}>
                                        <button>EDIT</button>
                                    </Link>
                                </td>
                                
                                <td>
                                    <button onClick={(event) => handleSubmit(event, product.products[0].id)}>DELETE</button>
                                </td>
                            </tr>
                    )}
                        
                        {/* {roll_button_status ? <Roll_button get_more_products={get_more_products}></Roll_button> : <></>} */}
                        </tbody>
                    </table>
                    
                : <p>no records</p>
                : <AccessDenied></AccessDenied>}
            </>}
            
        </>
    )
}