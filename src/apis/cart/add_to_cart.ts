import Product, {ProductSize} from "../../interfaces/Product"

export default async function add_to_cart(product: Product, size: ProductSize){

    const form_data = new FormData()

    form_data.append("product", JSON.stringify(product))
    form_data.append("selected_size", JSON.stringify(size))

    console.log(process.env.REACT_APP_SECRET_SERVER_URL)

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/add_to_cart', {
            method: 'POST',
            body: form_data
        })

        console.log(responce)
        console.log(await responce.json())

        return [await responce.json(), undefined]

    } catch(err) {
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)

        return [undefined, err]
    }
}