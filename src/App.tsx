import "./css/App.css"

import {Routes, Route} from "react-router-dom";

import Admin_page from "./pages/admin/Admin_page"
import Header from "./components/Header";

import Admin_collection_edit from "./pages/admin/collection/Admin_collection_edit"
import Admin_collection_add from "./pages/admin/collection/Admin_collction_add";
import Admin_collection_page from "./pages/admin/collection/Admin_collection_page";

import Admin_product_edit from "./pages/admin/product/Admin_product_edit"
import Admin_product_add from "./pages/admin/product/Admin_product_add"
import Admin_product_page from "./pages/admin/product/Admin_product_page";

import Admin_refunds from "./pages/admin/refunds/Admin_refunds";

import Main from "./pages/user/Main"
import Item_info from "./pages/user/Item_info"
import Prepare_order from "./pages/user/Prepare_order"
import User_options from "./pages/user/logged_in/User_menu";

import Refunds from "./pages/user/logged_in/refunds/Refunds";
import Order_refund from "./pages/user/logged_in/refunds/Order_refund";
import Placed_returns from "./pages/user/logged_in/refunds/Placed_returns";

import Forgot_psw from "./pages/user/forgot_psw/Forgot_psw";
import Code_psw from "./pages/user/forgot_psw/Code_psw";
import New_psw from "./pages/user/forgot_psw/New_psw"

import Psw_change from "./pages/user/logged_in/pws_edit/Psw_change";

import Orders from "./pages/user/logged_in/Orders";

import Admin_order_page from "./pages/admin/orders/Admin_order_page";
import Order_completed from "./pages/user/Order_complete";

import Account_info from "./pages/user/logged_in/user_info/Account_info";
import Edit_delivery_info from "./pages/user/logged_in/user_info/Edit_delivery_info";

import Add_delivery_info from "./pages/user/logged_in/Add_delivery_info";

import Login from "./pages/user/Login.";
import Register from "./pages/user/Register";

import About from "./pages/user/About";
import Refund from "./pages/user/Refund_log_of";

import Collections from "./pages/user/Collections";
import Collection_product_showcase from "./pages/user/Showcase";

import Padding from "./components/Padding";

export default function App(){
  
  return(
    <>
      <Header></Header>

        <Routes>
          <Route path="/" element={<Main />} />

          <Route path="/admin_page" element={<Admin_page />} />

              <Route path="/admin_collection_page" element={<Admin_collection_page/>} />
              <Route path="/admin_product_page" element={<Admin_product_page />} />
              

                  <Route path="/admin_collection_add" element={<Admin_collection_add />} />
                  <Route path="/admin_product_add" element={<Admin_product_add />} />

                  <Route path="/admin_collection_edit" element={<Admin_collection_edit />} />
                  <Route path="/admin_product_edit" element={<Admin_product_edit />}  />
                  
          
          <Route path="/main" element={<Main />} />
          <Route path="/item-info/:id" element={<Item_info />} /> 
          <Route path="/prepare-order" element={<Prepare_order/>} />

          <Route path="/user-menu" element={<User_options />} />

          <Route path="/refunds" element={<Refunds />} />
          <Route path="/place-refund" element={<Order_refund />} />
          <Route path="/placed-returns" element={<Placed_returns />} />

          <Route path="/forgoten-password" element={<Forgot_psw />} />
          <Route path="/reset-password" element={<New_psw />} />
          <Route path="/code-check" element={<Code_psw />} />

          <Route path="/change-password" element={<Psw_change />} />

          <Route path="/orders" element={<Orders />} />
          <Route path="/order-completed" element={<Order_completed />} />

          <Route path="/admin_order_page" element={<Admin_order_page />} />

          <Route path="/account-info" element={<Account_info />} />
          <Route path="/edit-delivery-info" element={<Edit_delivery_info />} />

          <Route path="/add-delivery-info" element={<Add_delivery_info />} />

          <Route path="/admin_refunds" element={<Admin_refunds />} />

          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />

          <Route path="about_us" element={<About/>} />
          <Route path="make-refund" element={<Refund/>} />
          
          <Route path="/collections" element={<Collections/>} />
          <Route path="/showcase/:id" element={<Collection_product_showcase/>} />

      </Routes>

      

    </>
  )
}

//<Padding></Padding>