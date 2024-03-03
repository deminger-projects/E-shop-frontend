export default async function delete_from_cart(pozition: number){

    const form_data = new FormData()

        form_data.append("pozition", JSON.stringify(pozition))

        try{
            const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/delete_from_cart', {
                method: 'POST',
                body: form_data
            })

            return [await responce.json(), undefined]

        } catch(err) {
            console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            
            return [undefined, err]
        }
}