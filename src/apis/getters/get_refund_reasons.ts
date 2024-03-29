export default async function get_refund_reasons(){
    try {
        const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_refund_reasons', {
            method: 'POST'
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