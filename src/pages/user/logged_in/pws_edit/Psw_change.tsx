import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Access_denied from "../../Access_denied";

import edit_record from "../../../../apis/records/edit_record";
import get_psw_template from "../../../../templates/other/ger_psw_template";
import { useCookies } from "react-cookie";

import UserData from "../../../../interfaces/user/User_data";
import logoff_template from "../../../../templates/login/get_logoff_teplate";
import logoff from "../../../../apis/login/logoff";

export default function Psw_change(){

    const navigate = useNavigate();
    
    const [current_psw, set_current_psw] = useState<string>("");
    const [psw_input1, setPsw_input1] = useState<string>("");
    const [psw_input2, setPsw_input2] = useState<string>("");
    const [error_msg, set_error_msg] = useState<string>("");

    const [loading, set_loading] = useState<boolean>(true);

    const [data, set_data] = useState<any>();
    const [update, set_update] = useState<boolean>(true);

    const [cookies, setCookie] = useCookies(['user_data'])

    useEffect(() => {
        fetchData()
    }, [update])

    const fetchData = async () => {
        try {

            const email = cookies.user_data[0].email
            const password = cookies.user_data[0].password

            const form_data = new FormData()

            form_data.append("email", JSON.stringify(email))
            form_data.append("password", JSON.stringify(password))

          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_user_data', {
            method: 'POST',
            body: form_data
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();

          set_data(data);
           set_loading(false);

        } catch (error) {

          console.log(error);

           set_loading(false);
        }
      };

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault();

        if(data.password.toUpperCase() !== current_psw.toUpperCase()){set_error_msg("current password is incorect")}
        if(!psw_input2){set_error_msg("new again password in empty")}
        if(!psw_input1){set_error_msg("new password in empty")}
        if(!current_psw){set_error_msg("current password in empty")}
        if(psw_input1 !== psw_input2){set_error_msg("passwords do not match")}

        if(current_psw && psw_input1 && psw_input2 && cookies.user_data[0].password.toUpperCase() === current_psw.toUpperCase() && psw_input1 === psw_input2){
        
            const psw_template = get_psw_template(psw_input1)

            await edit_record(psw_template, Number(data.id), Number(data.id), undefined, undefined, undefined, true)

            const temp = logoff_template()

            await logoff(temp, data.email, data.password)

            setCookie("user_data", "")

            navigate("/login", {state: {msg: "password changed"}})
        }

        set_loading(false)
        set_update(!update)

    }

    return(
        <>
            {loading ? <p>loading</p> : <>
                {cookies.user_data[0].login_status === "Active" ? 
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
            </>}
        </>
    )
}