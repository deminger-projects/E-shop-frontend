import { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";

import Access_denied from '../../user/Access_denied';

import login_data from "../../../data/login_data.json"
import products from "../../../data/products.json"

import Product from "../../../interfaces/Product";

import change_status from "../../../apis/records/change_status";
import Admin_collection_select from "../../../components/Admin/Admin_collection_select";
import get_product_status_change_template from "../../../templates/admin/get_product_status_change_template";

export default function Admin_product_page(){ 
    
    const location = useLocation();

    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "")
    const [error_msg, set_error_msg] = useState<string>("")

    const [search, set_search] = useState<string>("")
    const [search_collection, set_search_collection] = useState<string>("")

    const [products_arr, set_products_arr] = useState<Array<Product>>(products);

    useEffect(() => {      // searches products based on user input, valid input: product name, product size
        var res_arr: Array<Product> = []

        for(var product of products){ 
            var new_product: Product = product

            if(search && search_collection){
                if(new_product.products[0].collection_id){
                    if(new_product.products[0].product_name.includes(search) && new_product.products[0].collection_id.toString().includes(search_collection)){
                        res_arr.push(product)
                    }

                    if(search_collection === "NULL" && new_product.products[0].collection_id === null){
                        res_arr.push(product)
                    }
                }   
            }else if(search_collection){
                if(new_product.products[0].collection_id){
                    if(new_product.products[0].collection_id.toString().includes(search_collection)){
                        res_arr.push(product)
                    }
                }

                if(search_collection === "NULL" && new_product.products[0].collection_id === null){
                    res_arr.push(product)
                }
            }else if(search){
                if(new_product.products[0].product_name.includes(search)){
                    res_arr.push(product)
                }
            }
        }   

        if(!search && !search_collection){
            set_products_arr(products)
        }else{
            set_products_arr(res_arr)
        }
       
    },[search, search_collection])

    var handleSubmit = async (event: React.MouseEvent<HTMLElement>, record_id: number) =>{    
        
        event.preventDefault();

        const product_status_change_template = get_product_status_change_template()

        const [api_responce, error] = await change_status(product_status_change_template, record_id, login_data[0].users[0].id)

        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }
    }

    return( 
        <>
            <p>{responce_msg}</p>
            <p>{error_msg}</p>

            <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

            <select value={search_collection} onChange={(event) => set_search_collection(event.target.value)}>
                <option value={""}>select collection</option>
                <Admin_collection_select></Admin_collection_select>
            </select>            

            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? products.length > 0 ?
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

                    {products_arr.map((product: Product) => 
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
        </>
    )
}