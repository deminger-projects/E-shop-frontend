import { useState } from "react";
import { useNavigate } from "react-router-dom";

import send_aut_code from "../../../apis/other/send_aut_code";
import get_send_aut_code_template from "../../../templates/other/get_send_aut_code_template";

export default function Forgot_psw(){

    const navigate = useNavigate();
    
    const [email, setEmail] = useState<string>("");

    const [error_msg, set_error_msg] = useState<string>("");

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if(!email){set_error_msg("email empty")}

        if(email){

            const send_aut_code_template = get_send_aut_code_template(email)

            const [api_respocse, error] = await send_aut_code(send_aut_code_template)

            if(error){
                set_error_msg("error ocured")
            }else{
                if(api_respocse.status === false){
                    set_error_msg(api_respocse.msg)
                }else if(api_respocse.status === true){
                    navigate('/code-check',{state: {status: true, code: api_respocse.code, record_id: api_respocse.record_id, request: "psw_restart"}})
                }
            }
        }
    }

    return(
        <>
            <p>{error_msg}</p>

            <div>
                <form onSubmit={handleSubmit}>

                    <label htmlFor={"forgot"}>email</label>
                    <input id={"forgot"} type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <button>send</button>

                </form>
            </div>
           
        </>
    )
}