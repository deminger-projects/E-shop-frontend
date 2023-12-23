import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Access_denied from "../Access_denied";

import edit_record from "../../../apis/edit_record";

export default function New_psw(){
    
    const navigate = useNavigate();
    const location = useLocation();

    var is_valid = JSON.stringify(location.state) !== "null" ? location.state.status === true ? true : false : false

    const [psw_input1, setPsw_input1] = useState<string>();
    const [psw_input2, setPsw_input2] = useState<string>();
    const [error_msg, set_error_msg] = useState<string>();

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!psw_input2){set_error_msg("new again password in empty")}
        if(!psw_input1){set_error_msg("new password in empty")}
        if(psw_input1 !== psw_input2){set_error_msg("passwords do not match")}

        if(psw_input1 && psw_input2 && psw_input1 === psw_input2){
          
            var tables = {
                users: {password: psw_input1}
            }

            const [api_respocse, error] = await edit_record(tables, location.state.record_id)

            if(error){
                set_error_msg("error ocured")
            }else{
                navigate('/login',{state: {msg: api_respocse.msg}})
            }
        }    
    }

    return(
        <>
            {is_valid ? 
                <>
                    <p>{error_msg}</p>

                    <div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="first_psw">new password</label>
                            <input type="password" id="first_psw" value={psw_input1} onChange={(e) => setPsw_input1(e.target.value)}></input>

                            <label htmlFor="second_psw">new again password</label>
                            <input type="password" id="second_psw" value={psw_input2} onChange={(e) => setPsw_input2(e.target.value)}></input>

                            <button>send</button>
                        </form>
                        
                    </div>
                </> : <Access_denied></Access_denied>
            }
        </>
    )
}