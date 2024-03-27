import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Cart from '../../components/Cart';
import Product from '../../interfaces/Product';

export default function Showcase(){

    var url_data = useParams()
    const collection_id = Number(url_data.id)

    const [data, set_data] = useState<any>()
    const [data_display, set_data_display] = useState<any>()

    const [loading, set_loading] = useState<boolean>(true)

    const [search, set_search] = useState<string>("")

    useEffect(() => {      // searches products based on user input, valid input: product name
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
            console.log("search ano")
        }else{
            set_data_display(data)
            console.log("search ne")
        }
    },[search])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {

            const form = new FormData();

            form.append("id", JSON.stringify(collection_id))

          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_collection_product_showcase', {
            method: 'POST',
            body: form  
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          console.log("🚀 ~ fetchData ~ data:", data)

           set_data(data);
           set_data_display(data)
           
           set_loading(false);

        } catch (error) {

          console.log(error);

           set_loading(false);
        }
        console.log("🚀 ~ fetchData ~ data:", data)
    };
    
      return( 
        <>
            {loading ? <p>loading</p> : <>
                <Cart></Cart>

                <input type="string" value={search} onChange={(event) => set_search(event.target.value)}></input>

                <div className="grid-container">
                    {data_display.length !== 0 ?
                        data_display.map(((product: any) =>
                            <div key={product.products[0].id.toString()} className="grid-item">
                                <Link to={"/item-info/" + product.products[0].id} state={{product_data: product}}>
                                    <p>{product.products[0].product_name}</p>
                                    <img className="images" src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + product.products[0].id + "/" + product.products[0].url} width={"100px"} height={"100px"}></img>
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