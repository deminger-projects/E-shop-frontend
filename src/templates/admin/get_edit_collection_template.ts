import Files from "../../interfaces/Files"

const edit_collection_template = (collection_name: string, collection_id: number|null, ursl: Array<string>) => {
    
    return {
        collections: {name$: collection_name},
        collection_images: {collection_id: collection_id, image_url: ursl}
    }
}

export default edit_collection_template