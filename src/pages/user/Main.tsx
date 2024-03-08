import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Cart from "../../components/Cart";

import Product from "../../interfaces/Product"
import { useCookies } from "react-cookie";

export default function Main(){

    const location = useLocation()
    
    const [loading, set_loading] = useState<boolean>(true)

    const [search, set_search] = useState<string>("")
    const [products_arr, set_products_arr] = useState<Array<Product>>([]);

    useEffect(() => {      // searches products based on user input, valid input: product name, product size
        var res_arr: Array<Product> = []

        for(var product of products_arr){ 
            if(search){
                var new_product: Product = product
                if(new_product.products[0].product_name.includes(search)){
                    res_arr.push(product)
                }
            }
        }   

        if(search){
            set_products_arr(res_arr)

        }else{
            set_products_arr(products_arr)
        }
    },[search])

    
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/test_request', {
            method: 'GET'  
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_products_arr(data)
          set_loading(false);

        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };

 
    return( 
        <>
            {location.state ? <p>{location.state.msg}</p> : <></>}

            {loading ? <p>loading</p> : <>
                <Cart></Cart>

                <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

                <div className="grid-container">
                    {products_arr.length !== 0 ?
                        products_arr.map(((product: Product) =>
                            <div key={product.products[0].id.toString()} className="grid-item">
                                <Link to={"/item-info/" + product.products[0].id} state={{product_data: product}}>
                                    <p>{product.products[0].product_name}</p>
                                    <img className="images" src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + product.products[0].id + "/" + "/" + product.products[0].url} width={"100px"} height={"100px"}></img>
                                    <p>{product.products[0].price}</p>
                                </Link>
                                                
                                <br></br>
                                <br></br>
                            </div>  
                        ))
                        
                    : <p>no records</p> }
                </div>
            </>}
                    
        </>
    )
}