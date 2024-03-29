import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Cart from "../../components/Cart";

import Collections from "../../interfaces/Collections";
import get_collections_showcase from "../../apis/getters/get_collection_showcase";
import Collection_comp from "../../components/Collection";
import Loading from "../../components/Loading";

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
        const fetchData = async () => {
            var data = await get_collections_showcase()

            set_collection_arr(data)
            set_search_collections_display(data)
            set_loading(false);
          };

        fetchData()
    }, [])
 
    return( 
        <>
            {location.state ? <p>{location.state.msg}</p> : <></>}

            {loading ? <Loading></Loading> : <>
                <Cart></Cart>

                <input type="string" value={search_value} onChange={(event) => set_search_value(event.target.value)}></input>

                <div className="grid-container">
                    {collection_arr_display.length !== 0 ?
                        collection_arr_display.map(((collection: Collections) =>
                            <Collection_comp key={collection.collections[0].id.toString()} item={collection}></Collection_comp>
                        ))
                    : <p>no records</p> }
                </div>
            </>}
                    
        </>
    )
}