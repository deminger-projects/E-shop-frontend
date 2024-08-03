export default async function get_admin_products_images(last_item_id: number){
    try {

      const form_data = new FormData()

      form_data.append("id", JSON.stringify(last_item_id))

        const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_products_images', {
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