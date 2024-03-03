import Tables from "../../interfaces/Tables"
import logoff_template_interface from "../../interfaces/templates/login/logoff_template"

export default async function logoff(logoff_template: logoff_template_interface, record_id: number, user_id?: number){

    const form_data = new FormData()

    form_data.append("tables", JSON.stringify(logoff_template))
    form_data.append("record_id", JSON.stringify(record_id))

    if(user_id){
        form_data.append("user_id", JSON.stringify(user_id))
    }

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/logoff_request', {
            method: 'POST',
            body: form_data
        })

        return [await responce.json(), undefined]

    } catch(err){
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
        
        return [undefined, err]
    }
}