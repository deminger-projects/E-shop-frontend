import { Link } from 'react-router-dom';

import Access_denied from '../user/Access_denied';

import { useCookies } from 'react-cookie';

export default function Admin_page(){

    const [cookies, setCookie] = useCookies(['user'])

    return(
        <>
            {cookies.user[0].login_status === "Active" && cookies.user[0].username === "Admin" ? 
                <div>
                    <Link to="/admin_collection_page"><button>collections page</button></Link>
                    <Link to="/admin_product_page"><button>products page</button></Link>
                    <Link to="/admin_order_page"><button>orders page</button></Link>

                    <Link to="/admin_collection_add"><button>Add collections</button></Link>
                    <Link to="/admin_product_add"><button>Add products</button></Link>

                    <Link to="/admin_refunds"><button>refunds</button></Link>
                </div> 
                
                : <Access_denied></Access_denied>}
        </>
    )
}