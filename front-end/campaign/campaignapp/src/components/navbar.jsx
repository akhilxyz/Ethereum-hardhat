import { Link } from "react-router-dom";

function Navbar() {
    return ( 
      <>
        <nav className="container-fluid nav">
        <div className="container cf">
          <div className="brand">
            <a href="#splash">D-campaign</a>
          </div>
          <i className="fa fa-bars nav-toggle" />
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/campaign">Campaigns</Link></li>
            {/* <li><Link to="#contact">Help</Link></li> */}
          </ul>
        </div>
      </nav>
      <div style={{marginBottom : '75px'}}></div>
      </>
  );
}

export default Navbar;