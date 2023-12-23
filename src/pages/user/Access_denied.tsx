import { Link } from 'react-router-dom';

export default function Access_denied(){

    return(
        <>
            <div>
                <p>acces denied</p>
                <Link to="/user_index">home</Link>
            </div>
        </>
    )
}