import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Cart from "../../components/Cart";

import products from "../../data/products.json"

import Product from "../../interfaces/Product"

export default function Main(){

    const location = useLocation()

    const [search, set_search] = useState<string>("")
    const [products_arr, set_products_arr] = useState<Array<Product>>(products);

    useEffect(() => {      // searches products based on user input, valid input: product name, product size
        var res_arr: Array<Product> = []

        for(var product of products){ 
           var product_w_type: Product = product  // nemelo by byt potreba, ale haze error ze never
            if(search){
                if(product_w_type.products[0].product_name.includes(search)){
                    res_arr.push(product)
                }
            }
        }   

        if(search){
            set_products_arr(res_arr)

        }else{
            set_products_arr(products)
        }
    },[search])

    return( 
        <>
            {location.state ? <p>{location.state.msg}</p> : <></>}

            <Cart></Cart>

            <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

            <div className="grid-container">
                {products.length !== 0 ?
                    products_arr.map(((product: Product) =>
                        <div key={product.products[0].id.toString()} className="grid-item">
                            <Link to="/item-info" state={{product_data: product}}>
                                <p>{product.products[0].product_name}</p>
                                <img className="images" src={"/images/products/" + product.products[0].id + "/" + "/" + product.products[0].url} width={"100px"} height={"100px"}></img>
                                <p>{product.products[0].price}</p>
                            </Link>
                                            
                            <br></br>
                            <br></br>
                        </div>  
                    ))
                    
                : <p>no records</p> }
            </div>

            
        </>
    )
}