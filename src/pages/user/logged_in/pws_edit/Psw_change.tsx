import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Access_denied from "../../Access_denied";

import edit_record from "../../../../apis/records/edit_record";
import get_psw_template from "../../../../templates/other/ger_psw_template";
import { useCookies } from "react-cookie";

export default function Psw_change(){

    const navigate = useNavigate();
    
    const [current_psw, set_current_psw] = useState<string>("");
    const [psw_input1, setPsw_input1] = useState<string>("");
    const [psw_input2, setPsw_input2] = useState<string>("");
    const [error_msg, set_error_msg] = useState<string>("");

    const [cookies, setCookie] = useCookies(['user'])

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(cookies.user[0].password !== current_psw){set_error_msg("current password is incorect")}
        if(!psw_input2){set_error_msg("new again password in empty")}
        if(!psw_input1){set_error_msg("new password in empty")}
        if(!current_psw){set_error_msg("current password in empty")}
        if(psw_input1 !== psw_input2){set_error_msg("passwords do not match")}

        if(current_psw && psw_input1 && psw_input2 && cookies.user[0].password === current_psw && psw_input1 === psw_input2){
        
            const psw_template = get_psw_template(psw_input1)

            const api_respocse = await edit_record(psw_template, cookies.user[0].id, cookies.user[0].id, undefined, undefined, undefined, true)

            navigate("/main", {state: {msg: "password changed"}})
        }
    }

    return(
        <>
            {cookies.user[0].login_status === "Active" ? 
                <><p>{error_msg}</p>

                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="current_psw">Current password</label>
                        <input type="text" id="current_psw" value={current_psw} onChange={(e) => set_current_psw(e.target.value)}></input>


                        <label htmlFor="first_psw">new password</label>
                        <input type="text" id="first_psw" value={psw_input1} onChange={(e) => setPsw_input1(e.target.value)}></input>

                        <label htmlFor="second_psw">new again password</label>
                        <input type="text" id="second_psw" value={psw_input2} onChange={(e) => setPsw_input2(e.target.value)}></input>

                        <button>send</button>
                    </form>
                    
                </div>
                </> : <Access_denied></Access_denied>
            }
        </>
    )
}