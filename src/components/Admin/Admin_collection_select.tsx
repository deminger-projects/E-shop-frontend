import Collections from "../../interfaces/Collections"

export default function Admin_collection_select(props: {collections: Array<Collections>|undefined}){

    return(
        <>
            {props.collections ? <>
                <option value={"null"}>NONE</option>
                
                {props.collections.map((collection: Collections) => 
                    <option key={collection.collections[0].id} value={collection.collections[0].id}>{collection.collections[0].name}</option> 
                )}
            </> : ""}
            
        </>
    )
}