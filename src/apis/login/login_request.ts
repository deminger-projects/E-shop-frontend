import login_template_interface from "../../interfaces/templates/login/login_template"

export default async function login_reguest(login_template: login_template_interface){
   
    const form_data = new FormData()

    form_data.append("tables", JSON.stringify(login_template))

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/login_request', {
            method: 'POST',
            body: form_data
        })

        console.log(responce)
        return [await responce.json(), undefined]

    } catch(err) {
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            
        return [undefined, err]
    }
}