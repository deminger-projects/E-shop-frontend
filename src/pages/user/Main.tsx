import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Cart from "../../components/Cart";

import Product from "../../interfaces/Product"
import get_main_page_data from "../../apis/getters/get_main_page_data";
import Product_comp from "../../components/Product";
import Loading from "../../components/Loading";

export default function Main(){

    const location = useLocation()
    
    const [loading, set_loading] = useState<boolean>(true)

    const [search, set_search] = useState<string>("")
    const [products_arr, set_products_arr] = useState<Array<Product>>([]);
    const [products_arr_display, set_products_arr_display] = useState<Array<Product>>([]);

    useEffect(() => {      // searches products based on user input, valid input: product name
        var res_arr: Array<Product> = []

        for(var product of products_arr){ 
            if(search){
                var new_product: Product = product
                if(new_product.products[0].product_name.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                    res_arr.push(product)
                }
            }
        }           

        if(search){
            set_products_arr_display(res_arr)
        }else{
            set_products_arr_display(products_arr)
        }
    },[search])

    
    useEffect(() => {
        const fetchData = async () => {
            var data = await get_main_page_data()

            set_products_arr(data)
            set_products_arr_display(data)
            set_loading(false);
          };

        fetchData()
    }, [])

    return( 
        <>
            {location.state ? <p>{location.state.msg}</p> : <></>}

            {loading ? <Loading></Loading> : <>
                <Cart></Cart>

                <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

                <div className="grid-container">
                    {products_arr_display.length !== 0 ?
                        products_arr_display.map(((product: Product) =>
                            <Product_comp key={product.products[0].id.toString()} item={product}></Product_comp>
                        ))
                        
                    : <p>no records</p> }
                </div>
            </>}
                    
        </>
    )
}