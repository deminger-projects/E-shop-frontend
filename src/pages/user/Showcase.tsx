import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Cart from '../../components/Cart';
import Product from '../../interfaces/Product';
import get_collection_product_showcase from '../../apis/getters/get_collection_product_showcase';
import Product_comp from '../../components/Product';
import Loading from '../../components/Loading';
import Roll_button from '../../components/Roll_button';

export default function Showcase(){

    const url_data = useParams()
    const collection_id = Number(url_data.id)

    const [roll_button_status, set_roll_button_status] = useState<boolean>(false)
    const [last_item_id, set_last_item_id] = useState<number>(0)

    const [data, set_data] = useState<Array<Product>>([])
    const [data_display, set_data_display] = useState<Array<Product>>([])

    const [loading, set_loading] = useState<boolean>(true)

    const [search, set_search] = useState<string>("")

    useEffect(() => {      //search bar
        var res_arr: Array<Product> = []
    
        if(data){
            for(var product of data){ 
                if(search){
                    var new_product: Product = product
                    if(new_product.products[0].product_name.toLocaleLowerCase().includes(search.toLocaleLowerCase())){
                        res_arr.push(product)
                    }
                }
            }   
        }

        if(search){
            set_data_display(res_arr)
        }else{
            set_data_display(data)
        }
    },[search, data])

    useEffect(() => {   //ziskava collection_product_showcase data
        const fetchData = async () => {
            var data = await get_collection_product_showcase(collection_id, last_item_id)

            set_data(data)
            set_data_display(data)

            set_loading(false)
        };

        fetchData()
    }, [collection_id])


    var get_more_products = async () => {
        set_loading(true)

        var data1 = await get_collection_product_showcase(collection_id, last_item_id)

        if(data1.length > 0){
            var products_arr_copy = [...data]
            var new_data = products_arr_copy.concat(data1)
    
            set_data(new_data)
            set_data_display(new_data)
    
            set_last_item_id(data1[data1.length - 1].collections[0].id)
            
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
                <Cart></Cart>

                <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

                <div className="grid-container">
                    {data_display.length !== 0 ?
                        data_display.map(((product: Product) =>
                            <Product_comp key={product.products[0].id.toString()} item={product}></Product_comp>
                        ))
            
                    : <p>no records</p> }
                </div>

                {roll_button_status ? <Roll_button get_more_products={get_more_products}></Roll_button> : <></>}

            </>}
                    
        </>
    )
}