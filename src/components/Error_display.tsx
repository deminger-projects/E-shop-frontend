import { Link } from "react-router-dom";

import Login_hud from "./Login_hud";
import Menu from "./Menu";
import Collection_menu from "./Collection_menu";

export default function Error_display(props: {responce_api: any}){

    return(
        <>
            <div id="header">
                <Collection_menu></Collection_menu>

                <Link id="company_name" to="/main">company name (nbc)</Link>
                <Login_hud></Login_hud>

                <Menu></Menu>
            </div>
        </>
    )
}