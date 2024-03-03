import Files from "../../interfaces/Files"

const product_template = (collection_id: number|null|string, name: string, cost: number, description: string, size: Array<string>, product_id: number|null, current_amount: Array<string>, image_url: Array<string>, files?: Files) => {
    
    if(collection_id === "null"){
        collection_id = null
    }

    if(files){
        return {
            products: {collection_id: collection_id, name$: name, price: cost, description: description},
            product_sizes: {product_id: product_id, size: size, current_amount: current_amount},
            product_images: {product_id: product_id, image_url: image_url}
        }
    }

    return {
        products: {collection_id: collection_id, name$: name, price: cost, description: description},
        product_sizes: {product_id: product_id, size: size, current_amount: current_amount}
    }
    
}

export default product_template