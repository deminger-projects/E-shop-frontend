export default async function generate_order_code(){
    try {

        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/generate_order_code', {
            method: 'POST',
        })

        const data = await responce.json()

      return data

    } catch (error) {

      console.log(error);
    }
}