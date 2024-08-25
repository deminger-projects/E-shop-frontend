export default async function get_admin_orders(status:string){

    try {

      const form = new FormData();

      form.append("status", JSON.stringify(status))

        const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_orders', {
            method: 'POST',
            body: form
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