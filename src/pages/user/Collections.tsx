import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Cart from "../../components/Cart";

import Collections from "../../interfaces/Collections";

export default function Collections_showcase(){

    const location = useLocation()
    
    const [loading, set_loading] = useState<boolean>(true)

    const [search_value, set_search_value] = useState<string>("")
    const [collection_arr, set_collection_arr] = useState<Array<Collections>>([]);
    const [collection_arr_display, set_search_collections_display] = useState<Array<Collections>>([]);

    useEffect(() => {
        var res_arr: Array<Collections> = []

        for(var colletion of collection_arr){             
            if(search_value){
                var new_collection: Collections = colletion

                if(new_collection.collections[0].name.toLocaleLowerCase().includes(search_value.toLocaleLowerCase())){
                    res_arr.push(colletion)
                }
            }
        }   

        if(!search_value){
            set_search_collections_display(collection_arr)
        }else{
            set_search_collections_display(res_arr)
        }

    },[search_value])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_collections_showcase', {
            method: 'POST'  
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_collection_arr(data)
          set_search_collections_display(data)
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

                <input type="string" value={search_value} onChange={(event) => set_search_value(event.target.value)}></input>

                <div className="grid-container">
                    {collection_arr_display.length !== 0 ?
                        collection_arr_display.map(((collection: Collections) =>
                            <div key={collection.collections[0].id.toString()}>
                                <Link to={"/showcase/" + collection.collections[0].id}>
                                    <p>{collection.collections[0].name}</p>
                                    <img className="images" src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/collections/" + collection.collections[0].id + "/" + collection.collections[0].image_url} width={"100px"} height={"100px"}></img>
                                </Link>
                            </div>
                        ))
                        
                    : <p>no records</p> }
                </div>
            </>}
                    
        </>
    )
}