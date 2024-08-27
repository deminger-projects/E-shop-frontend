import { Link } from 'react-router-dom';

import AccessDenied from '../user/Access_denied';

import { useEffect, useState } from 'react';
import check_for_admin from '../../functions/sub_functions/check_for_admin';
import Loading from '../../components/Loading';

export default function Admin_page(){

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))
    
    const [is_admin, set_is_admin] = useState<boolean>(false)

    const [loading, set_loading] = useState<boolean>(true)

    useEffect(() => {
        set_loading(true)
        const temp = async() => {
            if(user_data.length > 0){
                var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

                if(is_admin.next_status === true){
                    set_is_admin(true)
                    set_loading(false)

                }
            }
        }
        temp()

    }, [user_data])

    return(
        <>
            {loading ? <Loading></Loading> : is_admin ? 
            <>
                <br />
                <div>
                        <Link to="/admin_collection_page"><button>collections page</button></Link>
                        <Link to="/admin_product_page"><button>products page</button></Link>
                        <Link to="/admin_order_page"><button>orders page</button></Link>

                        <Link to="/admin_collection_add"><button>Add collections</button></Link>
                        <Link to="/admin_product_add"><button>Add products</button></Link>

                        <Link to="/admin_refunds"><button>refunds</button></Link>
                    </div> 
            </>
                
                
                : <AccessDenied></AccessDenied>}
        </>
    )
}