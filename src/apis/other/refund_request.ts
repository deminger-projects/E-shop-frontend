import Tables from "../../interfaces/Tables"
import refund_template_interface from "../../interfaces/templates/refund_template"

export default async function refund_request(refund_template: any, email: string, is_refund?: boolean){

    const form_data = new FormData()

    form_data.append("email", JSON.stringify(email))
    form_data.append("tables", JSON.stringify(refund_template))

    if(is_refund){
        form_data.append("refund", JSON.stringify(is_refund))
    }

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/refund_request', {
            method: 'POST',
            body: form_data
        })
        return [await responce.json(), undefined]

    } catch(err) {
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            
        return [undefined, err]
    }                    
}