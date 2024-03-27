import { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";

import Access_denied from '../../user/Access_denied';

import Product from "../../../interfaces/Product";

import change_status from "../../../apis/records/change_status";
import Admin_collection_select from "../../../components/Admin/Admin_collection_select";
import get_product_status_change_template from "../../../templates/admin/get_product_status_change_template";
import { useCookies } from "react-cookie";
import check_for_admin from "../../../functions/sub_functions/check_for_admin";

export default function Admin_product_page(){ 
    
    const location = useLocation();

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
            var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

            if(is_admin.next_status === true){
                set_is_admin(true)
            }
        }

        temp()
    }, [])

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
                    if(search_collection == "null" && new_product.products[0].collection_id === null && new_product.products[0].product_name.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                        res_arr.push(product)
                    }
                }
            }else if(search_collection){
                if(new_product.products[0].collection_id){
                    if(new_product.products[0].collection_id.toString().includes(search_collection)){
                        res_arr.push(product)
                    }
                }

                if(search_collection == "null" && new_product.products[0].collection_id === null){
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
       
    },[search, search_collection])

    useEffect(() => {
        fetchData()
    }, [update])

    const fetchData = async () => {
        try {
          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_products', {
            method: 'POST'  
        }); 

        const response2 = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_collections', {
            method: 'POST'  
        }); 

          if (!response.ok && !response2.ok) {
            throw new Error('Network response was not ok.');
          }
 
          const data1 = await response.json();
          const data2 = await response2.json();


          set_products_arr(data1)
          set_fetch_collections(data2)
          set_products_arr_display(data1)

          set_loading(false);
          
        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };


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


    return( 
        <>

            {loading ? <p>loading</p> : <>
                <p>{responce_msg}</p>
                <p>{error_msg}</p>

                <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

                <select value={search_collection} onChange={(event) => set_search_collection(event.target.value)}>
                    <option value={""}>select collection</option>
                    <Admin_collection_select collections={fetch_collections}></Admin_collection_select>
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
                                    <img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + product.products[0].id + "/" + product.products[0].url} width={"100px"} height={"100px"}></img>
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
                        </tbody>
                    </table>
                : <p>no records</p>
                : <Access_denied></Access_denied>}
            </>}
            
        </>
    )
}