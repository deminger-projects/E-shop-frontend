import send_aut_code_template_interface from "../../interfaces/templates/other/send_aut_code_template";

export default async function send_aut_code(send_aut_code_template: send_aut_code_template_interface){

    const form_data = new FormData();   

    form_data.append("tables", JSON.stringify(send_aut_code_template))
    form_data.append("auth_code", JSON.stringify(true))

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/send_aut_code', {
            method: 'POST',
            body: form_data  
        })

        return [await responce.json(), undefined]

    } catch(err) {
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            
        return [undefined, err]
    }
}