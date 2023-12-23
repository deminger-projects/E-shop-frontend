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
              <li><Link to="/contact_us">Contact Us</Link></li>
              <li><Link to="/make-refund">make a refund</Link></li>
              <li><Link to="/about_us">about us</Link></li>
              <li><Link to="/more">more</Link></li>
          </ul>
        : <></>}
    </div>
  );
}