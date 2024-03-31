import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

export default function Code_psw(){

    const navigate = useNavigate();
    const location = useLocation();
    
    const [user_code, setUser_code] = useState<string>("");

    useEffect(() => {
        if(Number(user_code) ===  Number(location.state.code)){
            if(location.state.request === "refund"){
                navigate('/place-refund',{state: {data: location.state.data}})
            }else if(location.state.request === "psw_restart"){
                navigate('/reset-password',{state: {status: true, record_id: location.state.record_id}})
            }
        }
    }, [user_code])

    return(

        <>
            <p>code send to email</p>

            <div>
                <label htmlFor="code">code</label>
                <input id="code" type="number" onChange={(e) => setUser_code(e.target.value)}></input>
            </div>
        </>
    )
}
