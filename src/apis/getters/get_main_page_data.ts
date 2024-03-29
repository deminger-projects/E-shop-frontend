export default async function get_main_page_data(){
    try {
    
    const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/main_page_request', {
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