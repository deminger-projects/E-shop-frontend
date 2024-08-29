import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import AccessDenied from "../../Access_denied";

import edit_record from "../../../../apis/records/edit_record";
import get_psw_template from "../../../../templates/other/ger_psw_template";

import logoff_template from "../../../../templates/login/get_logoff_teplate";
import logoff from "../../../../apis/login/logoff";
import get_user_data from "../../../../apis/getters/user/get_user_data";
import Loading from "../../../../components/Loading";
import check_password from "../../../../apis/other/check_password";
import Login_hud from "../../../../components/Login_hud";

export default function Psw_change(){

    const navigate = useNavigate();
    
    const [current_psw, set_current_psw] = useState<string>("");
    const [psw_input1, setPsw_input1] = useState<string>("");
    const [psw_input2, setPsw_input2] = useState<string>("");
    const [error_msg, set_error_msg] = useState<string>("");

    const [loading, set_loading] = useState<boolean>(true);

    const [data, set_data] = useState<any>();
    const [update, set_update] = useState<boolean>(true);

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    useEffect(() => {
        const fetchData = async () => {
            var data = await get_user_data(user_data[0].email, user_data[0].password)

            set_data(data);
            set_loading(false);
          };

        fetchData()
    }, [update, user_data])


    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();

        var user_data = await get_user_data(data.email, data.password)

        var psw_check_result = (await check_password(current_psw, user_data.password))[0].status        

        if(!psw_check_result){set_error_msg("Current password is incorrect")}
        if(!psw_input2){set_error_msg("New again password in empty")}
        if(!psw_input1){set_error_msg("New password in empty")}
        if(!current_psw){set_error_msg("Current password in empty")}
        if(psw_input1 !== psw_input2){set_error_msg("Passwords do not match")}

        if(current_psw && psw_input1 && psw_input2 && psw_check_result && psw_input1 === psw_input2){
        
            const psw_template = get_psw_template(psw_input1)

            await edit_record(psw_template, Number(data.id), Number(data.id), undefined, undefined, undefined, true)

            const temp = logoff_template()

            await logoff(temp, data.email, data.password)

            sessionStorage.setItem("user_data", JSON.stringify([]))

            navigate("/login", {state: {msg: "Password successfully changed"}})
        }

        set_loading(false)
        set_update(!update)
    }

    return(
        <>
            {loading ? <Loading></Loading> : <>
                {user_data.length > 0 ? 
                    <><p>{error_msg}</p>

                    <div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="current_psw">Current password</label>
                            <input type="password" id="current_psw" value={current_psw} onChange={(e) => set_current_psw(e.target.value)}></input>


                            <label htmlFor="first_psw">New password</label>
                            <input type="password" id="first_psw" value={psw_input1} onChange={(e) => setPsw_input1(e.target.value)}></input>

                            <label htmlFor="second_psw">New password again</label>
                            <input type="password" id="second_psw" value={psw_input2} onChange={(e) => setPsw_input2(e.target.value)}></input>

                            <button>Proceed</button>
                        </form>
                        
                    </div>
                    </> : <AccessDenied></AccessDenied>
                }
            </>}
        </>
    )
}