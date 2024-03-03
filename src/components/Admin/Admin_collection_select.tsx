import collctions from "../../data/collections.json"

import Collections from "../../interfaces/Collections"

export default function Admin_collection_select(){

    return(
        <>
            <option value={"null"}>NONE</option>
            {collctions.map((collection: Collections) => 
                <option key={collection.collections[0].id} value={collection.collections[0].id}>{collection.collections[0].name}</option> 
            )}
        </>
    )
}