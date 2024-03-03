import Tables from "../../interfaces/Tables"
import register_template_interface from "../../interfaces/templates/login/register_teplate"

export default async function refund_request(tables: register_template_interface){

    const form_data = new FormData()

    form_data.append("tables", JSON.stringify(tables))

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/register_request', {
            method: 'POST',
            body: form_data
        })
        return [await responce.json(), undefined]

    } catch(err) {
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            
        return [undefined, err]
    }
}