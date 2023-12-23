import DB_Data from "../interfaces/Tables";

export default async function get_stripe_payment_url(cart_products: Array<object>, tables: DB_Data){

    const form = new FormData();

    form.append("items", JSON.stringify(cart_products))
    form.append("tables", JSON.stringify(tables))

    try{

        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_stripe_payment_url', {
            method: 'POST',
            body: form
        })

        return [await responce.json(), undefined]
        
    } catch (err){
        console.log("🚀 ~ file: add_record.ts:40 ~ get_stripe_payment_url ~ err:", err)
        
        return [undefined, err]
    }

}