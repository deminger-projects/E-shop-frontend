import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {
  const [menu_status, set_menu_status] = useState(false);

  const handle_menu_status_change = () => {
    set_menu_status(!menu_status)
  }

  return (
    <div className="menu">
      <button className="menu-button" onClick={handle_menu_status_change}>Menu</button>
        {menu_status ? 
          <ul className="menu-options">
              <li onClick={handle_menu_status_change}><Link to="/make-refund">Make a refund</Link></li>
              <li onClick={handle_menu_status_change}><Link to="/about_us">About us</Link></li>
          </ul>
        : <></>}
    </div>
  );
}