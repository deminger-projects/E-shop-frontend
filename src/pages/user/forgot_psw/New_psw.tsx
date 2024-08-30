import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Access_denied from "../Access_denied";

import edit_record from "../../../apis/records/edit_record";
import get_psw_template from "../../../templates/other/ger_psw_template";
import Loading from "../../../components/Loading";

export default function New_psw(){
    
    const navigate = useNavigate();
    const location = useLocation();

    var is_valid = JSON.stringify(location.state) !== "null" ? location.state.status === true ? true : false : false

    const [psw_input1, setPsw_input1] = useState<string>("");
    const [psw_input2, setPsw_input2] = useState<string>("");
    const [error_msg, set_error_msg] = useState<string>("");

    const [loading, set_loading] = useState<boolean>(false);

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();

        if(!psw_input2){set_error_msg("New password again in missing")}
        if(!psw_input1){set_error_msg("New password in missing")}
        if(psw_input1 !== psw_input2){set_error_msg("Passwords do not match")}

        if(psw_input1 && psw_input2 && psw_input1 === psw_input2){

            const psw_template = get_psw_template(psw_input1)

            const [api_respocse, error] = await edit_record(psw_template, location.state.record_id, location.state.record_id, undefined, undefined, undefined, true)
            console.log("🚀 ~ handleSubmit ~ api_respocse:", api_respocse)
            
            if(error){
                set_error_msg("error ocured")
            }else{
                navigate('/login',{state: {msg: api_respocse.msg}})
            }
        }    

        set_loading(false)
    }

    return(
        <>
            {loading ? <Loading></Loading> : 
            <> 
                <p>{error_msg}</p>

                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="first_psw">New password</label>
                        <input type="password" id="first_psw" value={psw_input1} onChange={(e) => setPsw_input1(e.target.value)}></input>

                        <label htmlFor="second_psw">New password again</label>
                        <input type="password" id="second_psw" value={psw_input2} onChange={(e) => setPsw_input2(e.target.value)}></input>

                        <button>send</button>
                    </form>
                    
                </div>
            </>
            }
        </>
    )
}