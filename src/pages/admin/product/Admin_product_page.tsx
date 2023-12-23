import { useState } from "react";
import {Link, useLocation} from "react-router-dom";

import Access_denied from '../../user/Access_denied';

import login_data from "../../../data/login_data.json"
import products from "../../../data/products.json"

import Product from "../../../interfaces/Product";

import change_status from "../../../apis/change_status";

export default function Admin_product_page(){ 

    const location = useLocation();

    const [responce_msg, set_responce_msg] = useState<string>(location.state ? location.state.msg : "")
    const [error_msg, set_error_msg] = useState<string>()

    var handleSubmit = async (event: React.MouseEvent<HTMLElement>, record_id: number) =>{    
        
        event.preventDefault();
        
        var tables = {
            products: {status: "Inactive"},
        }

        const [api_responce, error] = await change_status(tables, record_id, login_data[0].users[0].id)

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

            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? products.length > 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>product name</th>
                            <th>cost</th>
                            <th>description</th>
                            <th>collection</th>
                            <th>main image</th>
                        </tr>
                    </thead>
                    
                    <tbody>

                    {products.map((product: Product) => 
                        <tr key={product.products[0].id}>
                            <td><p>{product.products[0].product_name}</p></td>
                            <td><p>{product.products[0].price}</p></td>
                            <td><p>{product.products[0].description}</p></td>
                            <td><p>{product.products[0].collection_name}</p></td>
                            
                            <td>
                                <img src={"images/products/" + product.products[0].id + "/" + product.products[0].url} width={"100px"} height={"100px"}></img>
                            </td>

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