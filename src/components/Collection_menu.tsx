import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';

import collections from "../data/collections.json"
import collection_products from "../data/collection_products.json"

import Collections from "../interfaces/Collections"

function Collection_menu(){

  const navigate = useNavigate();

    const [collection_menu_status, set_collection_menu_status] = useState<boolean>(false);

    const toggleMenu = () => {
      set_collection_menu_status(!collection_menu_status);
    };
  

    var handle_request = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>, collection_id: any) => {

        event.preventDefault();
    
        const form_data = new FormData();   

        form_data.append("collection_id", collection_id)

        console.log(collection_products)

        var responce = await fetch('http://localhost:8001/data_request', {
            method: 'POST',
            body: form_data
        })

        const responce_data = await responce.json()

        set_collection_menu_status(false)

        if(responce_data.status === true){
          navigate('/user_index',{state: {data: collection_products, status: true, responce_data: responce_data}})
        }        
        
    }

    return (
        <>
          <div id="collections">
            <button  onClick={() => set_collection_menu_status(!collection_menu_status)}>Collections</button>
            {collection_menu_status ? 
              collections.map((collection: Collections) => (
                <div>
                  <Link to={"/main"} state={{collection: collection}}></Link>
                </div>
              ))
              
            : <></>}
          </div>
        </>
    );

}



export default Collection_menu