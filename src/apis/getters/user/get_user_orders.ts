export default async function get_user_orders(email: string, password: string){
    try {

        const form_data = new FormData()

        form_data.append("email", JSON.stringify(email))
        form_data.append("password", JSON.stringify(password))

      const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_user_placed_orders', {
        method: 'POST',
        body: form_data
    }); 

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();

      return data

    } catch (error) {

      console.log(error);
    }
}