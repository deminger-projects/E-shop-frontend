export default async function cart_products_validation(templates: any){

    const form_data = new FormData()

    form_data.append("tables", JSON.stringify(templates))

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/validate_cart_items', {
            method: 'POST',
            body: form_data
        })

        return await responce.json()
    } catch(err) {
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            
        return [undefined, err]
    }                    
}