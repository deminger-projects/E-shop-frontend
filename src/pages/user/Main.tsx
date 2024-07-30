import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Cart from "../../components/Cart";

import Product from "../../interfaces/Product"
import get_main_page_data from "../../apis/getters/get_main_page_data";
import Product_comp from "../../components/Product";
import Loading from "../../components/Loading";
import Roll_button from "../../components/Roll_button";

import get_more_products1 from "../../functions/get_more_products";

export default function Main(){

    const location = useLocation()
    
    const [loading, set_loading] = useState<boolean>(true)

    const [roll_button_status, set_roll_button_status] = useState<boolean>(false)

    const [last_item_id, set_last_item_id] = useState<number>(0)

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
            var data = await get_main_page_data(last_item_id)

            if(data.length < 9){
                set_roll_button_status(false)
            }

            set_roll_button_status(true)

            set_products_arr(data)
            set_products_arr_display(data)

            set_last_item_id(data[data.length - 1].products[0].id)

            set_loading(false);
          };

        fetchData()
    }, [])


    //var get_more_products = get_more_products1(set_loading, get_main_page_data, set_roll_button_status, set_products_arr, set_products_arr_display, products_arr, last_item_id, last_item_id, set_last_item_id) 


    var get_more_products = async () => {
        set_loading(true)

        var data = await get_main_page_data(last_item_id)

        if(data.length > 0){
            var products_arr_copy = [...products_arr]
            var new_data = products_arr_copy.concat(data)
    
            set_products_arr(new_data)
            set_products_arr_display(new_data)
    
            set_last_item_id(data[data.length - 1].products[0].id)
            
            if(data.length < 9){
                set_roll_button_status(false)
            }
        }else{
            set_roll_button_status(false)
        }

        set_loading(false)
    }

    

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
                        : <p>no records</p>  }

                </div>

                {roll_button_status ? <Roll_button get_more_products={get_more_products}></Roll_button> : <></>}

            </>}
                    
        </>
    )
}